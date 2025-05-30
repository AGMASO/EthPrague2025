// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CrossChainBalanceFetcher.sol";

/**
 * @title DeployCrossChainBalanceFetcher
 * @notice Deployment script for CrossChainBalanceFetcher contract
 * @dev Uses Foundry's Script to deploy and initialize the contract
 */
contract DeployCrossChainBalanceFetcher is Script {
    // LayerZero V2 mainnet endpoint addresses (see docs layerzero scan)
    mapping(uint256 => address) private endpointAddresses;

    /**
     * @notice Set up the endpoint addresses for different networks
     */
    function setUp() public {
        // Mainnet endpoint addresses
        endpointAddresses[1] = 0x1a44076050125825900e736c501f859c50fE728c; // Ethereum
        endpointAddresses[42161] = 0x1a44076050125825900e736c501f859c50fE728c; // Arbitrum
        endpointAddresses[43114] = 0x32715752EAc2C0e348e16F4C797fefBc9b7377Fd; // Avalanche
        endpointAddresses[8453] = 0x1a44076050125825900e736c501f859c50fE728c; // Base (same as eth for now per docs)
        endpointAddresses[56] = 0xD061c9edF4E47447F16dA186FbA233A3Ff63fb48; // BNB
        endpointAddresses[10] = 0x1a44076050125825900e736c501f859c50fE728c; // Optimism
        endpointAddresses[137] = 0x1a44076050125825900e736c501f859c50fE728c; // Polygon
    }

    /**
     * @notice Main deployment script
     * @dev Deploys and initializes the CrossChainBalanceFetcher contract
     */
    function run() public {
        // Ensure endpointAddresses mapping is populated
        setUp();

        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);
        uint256 chainId = block.chainid;
        address endpoint = endpointAddresses[chainId];
        require(endpoint != address(0), "Unsupported chain, set in setUp");

        vm.startBroadcast(deployerPk);
        CrossChainBalanceFetcher fetcher = new CrossChainBalanceFetcher(endpoint, deployer);
        // activate default read channel
        fetcher.setReadChannel(fetcher.READ_CHANNEL(), true);
        vm.stopBroadcast();

        console2.log("CrossChainBalanceFetcher deployed", address(fetcher));
    }
}
