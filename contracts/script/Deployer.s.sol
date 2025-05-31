// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {OPSepoliaWalletStatusProver} from "../src/vlayer/OPSepoliaWalletStatusProver.sol";
import {OPSepoliaWalletStatusVerifier} from "../src/vlayer/OPSepoliaWalletStatusVerifier.sol";

contract DeployerScript is Script {
    function run() public returns (address proverAddress, address verifierAddress) {
        vm.startBroadcast();

        OPSepoliaWalletStatusProver prover = new OPSepoliaWalletStatusProver();
        console.log("OPSepoliaWalletStatusProver deployed at:", address(prover));

        OPSepoliaWalletStatusVerifier verifier = new OPSepoliaWalletStatusVerifier(address(prover));
        console.log("OPSepoliaWalletStatusVerifier deployed at:", address(verifier));

        vm.stopBroadcast();
        return (address(prover), address(verifier));
    }
}
