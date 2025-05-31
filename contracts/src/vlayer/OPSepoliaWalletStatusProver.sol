// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Prover} from "vlayer-0.1.0/Prover.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {IERC20} from "openzeppelin-contracts/interfaces/IERC20.sol";

contract OPSepoliaWalletStatusProver is Prover {
    address constant USDC = 0x5fd84259d66Cd46123540766Be93DFE6D43130D7;

    uint256 constant PERIOD = 216_000; // ~30 days at 12 s blocks
    uint256 constant STEP = 4_000; // sample every ~14 h

    function proveWalletStatus(address account) public returns (Proof memory, address, uint256, bool, bool) {
        /* eth balance */
        uint256 ethBalanceWei = account.balance;
        uint256 ethBalance = ethBalanceWei / 1e18;

        /* usdc balance */
        uint256 totalBalance = 0;
        uint256 iterations = 0;
        for (uint256 blockNo = block.number - PERIOD; blockNo <= block.number; blockNo += STEP) {
            setBlock(blockNo);
            totalBalance += IERC20(USDC).balanceOf(account) / 1e6;
            iterations += 1;
        }

        /* Determine status */
        bool isWhale = ethBalance >= 100;
        bool isActive = ethBalanceWei > 0.01 ether || totalBalance / iterations > 100;

        return (proof(), account, ethBalance, isWhale, isActive);
    }
}
