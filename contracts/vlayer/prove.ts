import { createVlayerClient } from "@vlayer/sdk";
import proverSpec from "../out/OPSepoliaWalletStatusProver.sol/OPSepoliaWalletStatusProver";
import verifierSpec from "../out/OPSepoliaWalletStatusVerifier.sol/OPSepoliaWalletStatusVerifier";
import { createContext, getConfig, waitForTransactionReceipt } from "@vlayer/sdk/config";

async function main() {
  const config = getConfig();
  console.log(`Running on chain: ${config.chainName}`);

  // Get context (client, account, etc.)
  const { ethClient, account, proverUrl } = createContext(config);

  if (!account) {
    throw new Error(
      "No account found. Make sure EXAMPLES_TEST_PRIVATE_KEY is set in your environment variables"
    );
  }
  console.log(`Using account: ${account.address}`);

  // Create vlayer client
  const vlayer = createVlayerClient({
    url: proverUrl,
    token: config.token,
  });

  // Read environment variables or use default values
  const proverAddress = process.env.VITE_PROVER_ADDRESS as `0x${string}`;
  const verifierAddress = process.env.VITE_VERIFIER_ADDRESS as `0x${string}`;

  if (!proverAddress || !verifierAddress) {
    throw new Error(
      "Missing contract addresses. Make sure you've deployed the contracts and set VITE_PROVER_ADDRESS and VITE_VERIFIER_ADDRESS"
    );
  }

  console.log(`Using prover at: ${proverAddress}`);
  console.log(`Using verifier at: ${verifierAddress}`);

  // Decide which wallet to prove.
  // Priority: CLI arg > WALLET_TO_CHECK env var > fallback demo address
  const cliArg = process.argv[2] as `0x${string}` | undefined;
  const walletToCheck = cliArg

  console.log(`Checking wallet status for: ${walletToCheck}`);

  // Call the prover to get a proof of the wallet's status
  console.log("\nGenerating wallet status proof...");
  const provingHash = await vlayer.prove({
    address: proverAddress,
    proverAbi: proverSpec.abi,
    functionName: "proveWalletStatus",
    args: [walletToCheck],
    chainId: ethClient.chain.id,
    gasLimit: config.gasLimit,
  });

  // Extract a readable hash string for logging without altering the original
  // `provingHash` value that is later passed to `waitForProvingResult`.
  const provingHashForLog =
    typeof provingHash === "string"
      ? provingHash
      : (provingHash as { hash?: string }).hash ?? JSON.stringify(provingHash);

  console.log(`Proving hash: ${provingHashForLog}`);
  console.log("Waiting for proving result...");

  // Wait for the proving result
  const result = await vlayer.waitForProvingResult({ hash: provingHash });
  console.log("\nProof generated successfully!");

  const [proof, accountAddress, ethBalance, isWhale, isActive] = result;

  // Submit the proof to the verifier
  console.log("\nSubmitting proof to verifier...");

  // Estimate gas for verification
  const gas = await ethClient.estimateContractGas({
    address: verifierAddress,
    abi: verifierSpec.abi,
    functionName: "submitWalletStatus",
    args: result,
    account,
    blockTag: "pending",
  });

  // Submit the proof
  const verificationHash = await ethClient.writeContract({
    address: verifierAddress,
    abi: verifierSpec.abi,
    functionName: "submitWalletStatus",
    args: result,
    account,
    gas,
  });

  console.log(`Verification transaction hash: ${verificationHash}`);
  console.log("Waiting for transaction confirmation...");

  // Wait for the transaction receipt
  const receipt = await waitForTransactionReceipt({
    client: ethClient,
    hash: verificationHash,
  });

  const verificationSuccess = receipt.status === "success";

  // Query wallet badges on-chain
  const badges = await ethClient.readContract({
    address: verifierAddress,
    abi: verifierSpec.abi,
    functionName: "getWalletBadges",
    args: [walletToCheck],
  });

  const badgeObj = {
    hasActiveWallet: badges[0],
    hasWhaleStatus: badges[1],
    whaleLevel: badges[2] as string,
    verifiedAt: Number(badges[3]), // unix seconds
  };

  // Compose JSON result (exclude balance/flags, always assume fresh)
  const output = {
    account: accountAddress,
    verificationSuccess,
    ...badgeObj,
  };

  // Print prettified JSON
  console.log("\n" + JSON.stringify(output, null, 2));
}

main().catch(console.error);
