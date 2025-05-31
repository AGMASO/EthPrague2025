// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {OPSepoliaWalletStatusProver} from "src/vlayer/OPSepoliaWalletStatusProver.sol";

contract OPSepoliaWalletStatusVerifier is Verifier {
    address public immutable prover;

    struct WalletStatus {
        uint256 ethBalance;
        bool isWhale;
        bool isActive;
        uint256 verifiedAt;
    }

    struct WhaleStatus {
        uint256 ethBalance;
        bool isWhale;
        uint256 verifiedAt;
    }

    mapping(address => WalletStatus) public walletStatuses;
    mapping(address => WhaleStatus) public whaleStatuses;
    mapping(bytes32 => bool) public processedProofs;

    uint256 constant WHALE_THRESHOLD = 1;

    /* EVENTS */
    event WalletStatusVerified(address indexed account, uint256 ethBalance, bool isWhale, bool isActive);
    event WhaleVerified(address indexed account, uint256 ethBalance, string whaleLevel);

    constructor(address _prover) {
        prover = _prover;
    }

    function submitWalletStatus(Proof calldata proof, address account, uint256 ethBalance, bool isWhale, bool isActive)
        public
        onlyVerified(prover, OPSepoliaWalletStatusProver.proveWalletStatus.selector)
    {
        bytes32 proofHash = keccak256(abi.encode(proof));
        require(!processedProofs[proofHash], "Proof already processed");

        processedProofs[proofHash] = true;

        walletStatuses[account] =
            WalletStatus({ethBalance: ethBalance, isWhale: isWhale, isActive: isActive, verifiedAt: block.timestamp});

        emit WalletStatusVerified(account, ethBalance, isWhale, isActive);
    }

    /* helpers */
    function getWhaleLevel(uint256 ethBalance) public pure returns (string memory) {
        if (ethBalance >= WHALE_THRESHOLD) return "Whale";
        return "Not a Whale";
    }

    function getWalletBadges(address account)
        public
        view
        returns (bool hasActiveWallet, bool hasWhaleStatus, string memory whaleLevel, uint256 verifiedAt)
    {
        WalletStatus memory status = walletStatuses[account];

        hasActiveWallet = status.isActive && status.verifiedAt > 0;
        hasWhaleStatus = status.isWhale;
        whaleLevel = getWhaleLevel(status.ethBalance);
        verifiedAt = status.verifiedAt;
    }

    function isFreshVerification(address account) public view returns (bool) {
        return walletStatuses[account].verifiedAt > block.timestamp - 1 days;
    }
}
