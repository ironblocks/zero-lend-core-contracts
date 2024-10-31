import { ethers } from "hardhat";
import * as poolImplementationJson from '../deployments/holesky/Pool-Implementation.json';

async function main() {
  const proxyAddress = "0xb8D338f5869740e432b27b017609B3d3872fe8ae";
  const policyAddress = "0x7Ec60768E1C4322d388dC6ca55C8DD2f1750c6fC";
  const testAsset = "0xdD467f67BFaeDf5d4e7c56b67B81C6F63263BDBe";
  
  const signer = await ethers.provider.getSigner();
  const signerAddress = await signer.getAddress();

  console.log("Using signer address:", signerAddress);

  const policyContract = await ethers.getContractAt(
    [
      "function approveCalls(bytes32[] calldata _callHashes, uint256 expiration, address txOrigin) external",
      "function getCallHash(address consumer, address sender, address origin, bytes memory data, uint256 value) public pure returns (bytes32)",
      "function hasRole(bytes32 role, address account) external view returns (bool)"
    ],
    policyAddress
  );

  try {
    // Check if signer has the SIGNER_ROLE
    const SIGNER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("SIGNER_ROLE"));
    const hasSigner = await policyContract.hasRole(SIGNER_ROLE, signerAddress);
    console.log("Has SIGNER_ROLE:", hasSigner);
    if (!hasSigner) {
      throw new Error("Account does not have SIGNER_ROLE");
    }

    const poolContract = await ethers.getContractAt(
      poolImplementationJson.abi,
      proxyAddress
    );

    // Get AToken address and prepare mint call
    const reserveData = await poolContract.getReserveData(testAsset);
    const aTokenAddress = reserveData.aTokenAddress;
    const amount = ethers.utils.parseUnits("10000", 6);

    // Generate AToken.mint() call data
    const aTokenContract = await ethers.getContractAt("AToken", aTokenAddress);
    const mintCallData = aTokenContract.interface.encodeFunctionData("mint", [
      signerAddress,    // caller - original sender, not Pool
      signerAddress,    // onBehalfOf - original sender
      amount,          // amount
      reserveData.liquidityIndex // index
    ]);

    // Calculate the call hash
    const mintCallHash = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ['address', 'address', 'address', 'bytes', 'uint256'],
        [
          aTokenAddress,  // consumer (AToken)
          proxyAddress,   // sender (Pool)
          signerAddress,  // origin (tx.origin)
          mintCallData,
          0               // value
        ]
      )
    );

    const expiration = Math.floor(Date.now() / 1000) + 3600;

    console.log("\nApproval Parameters:");
    console.log("Call Hash:", mintCallHash);
    console.log("Expiration:", expiration);
    console.log("Tx Origin:", signerAddress);

    console.log("\nHash Calculation Parameters:");
    console.log("AToken (consumer):", aTokenAddress);
    console.log("Pool (sender):", proxyAddress);
    console.log("Origin:", signerAddress);
    console.log("Mint Call Data:", mintCallData);

    // After calculating hash
    console.log("\nCalculated Hash:", mintCallHash);

    const tx = await policyContract.approveCalls(
      [mintCallHash],
      expiration,
      signerAddress
    );

    console.log("\nTransaction submitted:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");

  } catch (error: unknown) {
    console.error("Error details:", error);
    if (typeof error === 'object' && error !== null) {
      const err = error as { error?: { message?: string }; data?: unknown };
      if (err.error?.message) {
        console.error("Provider error message:", err.error.message);
      }
      if (err.data) {
        console.error("Error data:", err.data);
      }
    }
    }
  }

main()
  .then(() => process.exit(0))
  .catch(console.error);