// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OAppRead} from "@layerzerolabs/oapp-evm/contracts/oapp/OAppRead.sol";
import {MessagingFee, MessagingReceipt} from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import {ILayerZeroEndpointV2} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import {Origin} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import {
    ReadCodecV1,
    EVMCallRequestV1,
    EVMCallComputeV1
} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/ReadCodecV1.sol";
import {IOAppMapper} from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppMapper.sol";
import {IOAppReducer} from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppReducer.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CrossChainBalanceFetcher
 * @notice A contract that uses LayerZero's lzRead to fetch native token balances from multiple chains
 * @dev Inherits OAppRead to leverage LayerZero's cross-chain read capabilities
 */
contract CrossChainBalanceFetcher is OAppRead, IOAppMapper, IOAppReducer {
    using OptionsBuilder for bytes;
    using Strings for uint256;
    using Strings for uint32;

    // Channel ID for read operations - must match a configured channel in the ReadLib1002
    uint32 public constant READ_CHANNEL = 4294967295;

    // Message type identifier for read operations
    uint16 public constant READ_MSG_TYPE = 1;

    // Cache for balance requests and responses
    mapping(bytes32 => address) public requestToAddress;
    mapping(address => mapping(uint32 => uint256)) public addressBalances;
    mapping(address => uint32[]) public addressChains;
    mapping(address => bool) public addressProcessed;

    // Supported chains configuration
    struct ChainConfig {
        uint32 eid;
        uint16 confirmations;
        string name;
    }

    ChainConfig[] public supportedChains;

    // Events
    event BalanceRequestSent(bytes32 guid, address account);
    event BalancesUpdated(address indexed account, uint32[] chains, uint256[] balances);

    /**
     * @notice Constructor for the CrossChainBalanceFetcher contract
     * @param _endpoint The address of the LayerZero endpoint
     * @param _owner The address of the contract owner
     */
    constructor(address _endpoint, address _owner) OAppRead(_endpoint, _owner) Ownable(_owner) {
        // Initialize supported chains
        // These EIDs are for mainnet chains and must be compatible with lzRead and ReadLib1002
        supportedChains.push(ChainConfig(30101, 1, "Ethereum Mainnet")); // Ethereum Mainnet
        supportedChains.push(ChainConfig(30110, 1, "Arbitrum Mainnet")); // Arbitrum Mainnet
        supportedChains.push(ChainConfig(30106, 1, "Avalanche Mainnet")); // Avalanche Mainnet
        supportedChains.push(ChainConfig(30102, 1, "BNB Smart Chain")); // BNB Smart Chain Mainnet
        supportedChains.push(ChainConfig(30111, 1, "Optimism Mainnet")); // Optimism Mainnet
        supportedChains.push(ChainConfig(30109, 1, "Polygon Mainnet")); // Polygon Mainnet
    }

    /**
     * @notice Initialize the contract by setting up read channels
     * @dev Must be called after deployment to enable cross-chain reads
     */
    function initialize() external onlyOwner {
        // Set up read channel for each supported chain
        setReadChannel(READ_CHANNEL, true);
    }

    /**
     * @notice Fetches native token balances for an account across all supported chains
     * @param _account The address to check balances for
     * @return guid The unique identifier for the request
     */
    function fetchBalances(address _account) external payable returns (bytes32 guid) {
        // Construct the read command
        bytes memory cmd = getReadCommand(_account);

        // Calculate options with sufficient gas
        bytes memory options = OptionsBuilder.newOptions();
        options = options.addExecutorLzReadOption(500000, 1024, 0); // gas limit, calldata size, msg value

        // Use options directly without combining (the default OApp implementation doesn't need a combineOptions function)
        bytes memory combinedOptions = options;

        // Send the read request to LayerZero
        MessagingReceipt memory receipt =
            _lzSend(READ_CHANNEL, cmd, combinedOptions, MessagingFee(msg.value, 0), payable(msg.sender));

        // Store the request details for later processing
        guid = receipt.guid;
        requestToAddress[guid] = _account;

        // Clear any previous data for this address
        if (addressProcessed[_account]) {
            delete addressProcessed[_account];
            uint32[] memory chains = addressChains[_account];
            for (uint256 i = 0; i < chains.length; i++) {
                delete addressBalances[_account][chains[i]];
            }
            delete addressChains[_account];
        }

        emit BalanceRequestSent(guid, _account);
        return guid;
    }

    /**
     * @notice Constructs a read command to fetch balances from all supported chains
     * @param _account The address to check balances for
     * @return cmd The encoded read command
     */
    function getReadCommand(address _account) public view returns (bytes memory cmd) {
        uint256 chainCount = supportedChains.length;
        EVMCallRequestV1[] memory readRequests = new EVMCallRequestV1[](chainCount);

        for (uint256 i = 0; i < chainCount; i++) {
            ChainConfig memory config = supportedChains[i];

            // Create a call to get the balance using eth_getBalance RPC call
            // For native balance, we need a special encoding since we can't directly call eth_getBalance
            // We'll use a proxy call that DVNs can interpret
            readRequests[i] = EVMCallRequestV1({
                appRequestLabel: uint16(i + 1),
                targetEid: config.eid,
                isBlockNum: false,
                blockNumOrTimestamp: uint64(block.timestamp),
                confirmations: config.confirmations,
                to: address(0), // Special address that DVNs recognize for native balance
                callData: abi.encodePacked(_account) // Just pass the address
            });
        }

        // Set up compute settings to use our mapping and reduction functions
        EVMCallComputeV1 memory computeSettings = EVMCallComputeV1({
            computeSetting: 2, // Use both lzMap and lzReduce
            targetEid: ILayerZeroEndpointV2(endpoint).eid(),
            isBlockNum: false,
            blockNumOrTimestamp: uint64(block.timestamp),
            confirmations: 15,
            to: address(this)
        });

        // Encode the command with application label 0
        return ReadCodecV1.encode(0, readRequests, computeSettings);
    }

    /**
     * @notice Implementation of the lzMap function for mapping operations
     * @param _request The request data in bytes
     * @param _response The response data in bytes (the balance)
     * @return A bytes array with the mapped response
     */
    function lzMap(bytes calldata _request, bytes calldata _response) external pure override returns (bytes memory) {
        // Extract request details
        EVMCallRequestV1 memory request = abi.decode(_request, (EVMCallRequestV1));

        // For a balance request, response is uint256
        uint256 balance = 0;
        if (_response.length >= 32) {
            balance = abi.decode(_response, (uint256));
        }

        // Return the chain ID and balance
        return abi.encode(request.targetEid, balance);
    }

    /**
     * @notice Implementation of the lzReduce function for reducing operations
     * @param _cmd The command data in bytes
     * @param _responses An array of response data in bytes
     * @return A bytes array with the reduced response
     */
    function lzReduce(bytes calldata _cmd, bytes[] calldata _responses) external pure override returns (bytes memory) {
        // Extract number of responses
        uint256 responseCount = _responses.length;

        // Create arrays to hold chain IDs and balances
        uint32[] memory chainIds = new uint32[](responseCount);
        uint256[] memory balances = new uint256[](responseCount);

        // Extract chain IDs and balances from responses
        for (uint256 i = 0; i < responseCount; i++) {
            (uint32 chainId, uint256 balance) = abi.decode(_responses[i], (uint32, uint256));
            chainIds[i] = chainId;
            balances[i] = balance;
        }

        // Return the aggregated data
        return abi.encode(chainIds, balances);
    }

    /**
     * @notice Handles the response from LayerZero
     * @param _origin The origin information
     * @param _guid The unique identifier for the message
     * @param _message The encoded message data
     * @param _executor The executor address
     * @param _extraData Additional data
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        // Get the account address from the request mapping
        address account = requestToAddress[_guid];
        require(account != address(0), "Unknown request");

        // Decode the message to get chain IDs and balances
        (uint32[] memory chainIds, uint256[] memory balances) = abi.decode(_message, (uint32[], uint256[]));

        // Store the balances in the contract state
        for (uint256 i = 0; i < chainIds.length; i++) {
            addressBalances[account][chainIds[i]] = balances[i];
        }

        // Store the chains for this address
        addressChains[account] = chainIds;
        addressProcessed[account] = true;

        // Emit event with the balances
        emit BalancesUpdated(account, chainIds, balances);
    }

    /**
     * @notice Retrieves all balances for an account
     * @param _account The address to get balances for
     * @return chains Array of chain IDs
     * @return chainNames Array of chain names
     * @return balances Array of balances
     * @return processed Whether the account has been processed
     */
    function getBalances(address _account)
        internal
        view
        returns (uint32[] memory chains, string[] memory chainNames, uint256[] memory balances, bool processed)
    {
        processed = addressProcessed[_account];
        if (!processed) {
            return (new uint32[](0), new string[](0), new uint256[](0), false);
        }

        chains = addressChains[_account];
        uint256 chainCount = chains.length;
        balances = new uint256[](chainCount);
        chainNames = new string[](chainCount);

        for (uint256 i = 0; i < chainCount; i++) {
            balances[i] = addressBalances[_account][chains[i]];

            // Find chain name
            for (uint256 j = 0; j < supportedChains.length; j++) {
                if (supportedChains[j].eid == chains[i]) {
                    chainNames[i] = supportedChains[j].name;
                    break;
                }
            }
        }

        return (chains, chainNames, balances, processed);
    }

    /**
     * @notice Checks if an address has been processed
     * @param _account The address to check
     * @return Whether the address has been processed
     */
    function isProcessed(address _account) external view returns (bool) {
        return addressProcessed[_account];
    }

    /**
     * @notice Returns balances in JSON string format for ease of off-chain parsing
     */
    function getBalancesJson(address _account) external view returns (string memory json) {
        (uint32[] memory chains, string[] memory chainNames, uint256[] memory balances, bool processed) =
            getBalances(_account);

        bytes memory buf = "{";

        // chains array
        buf = abi.encodePacked(buf, "\"chains\":[");
        for (uint256 i = 0; i < chains.length; i++) {
            buf = abi.encodePacked(buf, chains[i].toString());
            if (i + 1 < chains.length) buf = abi.encodePacked(buf, ",");
        }
        buf = abi.encodePacked(buf, "],");

        // chainNames array
        buf = abi.encodePacked(buf, "\"chainNames\":[");
        for (uint256 i = 0; i < chainNames.length; i++) {
            buf = abi.encodePacked(buf, "\"", chainNames[i], "\"");
            if (i + 1 < chainNames.length) buf = abi.encodePacked(buf, ",");
        }
        buf = abi.encodePacked(buf, "],");

        // balances array
        buf = abi.encodePacked(buf, "\"balances\": [");
        for (uint256 i = 0; i < balances.length; i++) {
            buf = abi.encodePacked(buf, balances[i].toString());
            if (i + 1 < balances.length) buf = abi.encodePacked(buf, ",");
        }
        buf = abi.encodePacked(buf, "],");

        // processed bool
        buf = abi.encodePacked(buf, "\"processed\": ", processed ? "true" : "false", "}");

        json = string(buf);
    }
}
