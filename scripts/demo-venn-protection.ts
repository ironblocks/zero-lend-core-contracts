import { VennClient } from '@vennbuild/venn-dapp-sdk';
import { ethers } from "hardhat";
import { MaxUint256 } from "@ethersproject/constants";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  const signers = await ethers.getSigners();
  
  const deployer = signers[0];
  const borrower = signers[1];
  
  
  console.log("Using addresses derived from mnemonic:");
  console.log(`Deployer (index 3): ${deployer.address}`);
  console.log(`Borrower (index 4): ${borrower.address}`);
  
  const pool = await ethers.getContractAt("Pool", "0xb8D338f5869740e432b27b017609B3d3872fe8ae");
  const usdc = await ethers.getContractAt("MintableERC20", "0xdD467f67BFaeDf5d4e7c56b67B81C6F63263BDBe");
  
  console.log("\n=== Demonstrating Normal Protocol Interactions ===");
  
  const supplyAmount = parseUnits("10000", 6);
  await usdc.connect(deployer)["mint(address,uint256)"](deployer.address, supplyAmount);
  
  const balance = await usdc.balanceOf(deployer.address);
  console.log("Balance after mint:", balance.toString());
  console.log("Supply amount:", supplyAmount.toString());
  
  await usdc.connect(deployer).approve(pool.address, MaxUint256);

  // console.log("\n=== Demonstrating Transaction Failure Without Venn Approval ===");
  // try {
  //   console.log("Attempting supply without Venn approval...");
  //   const tx = await pool.connect(deployer).supply(
  //     usdc.address,
  //     supplyAmount,
  //     deployer.address,
  //     0,
  //     {
  //       gasLimit: 1000000
  //     }
  //   );
    
  //   console.log("Transaction sent:", tx.hash);
  //   const receipt = await tx.wait();
  //   console.log("Transaction mined:", {
  //     status: receipt.status,
  //     blockNumber: receipt.blockNumber,
  //     gasUsed: receipt.gasUsed.toString()
  //   });
  // } catch (error: any) {
  //   console.log("Transaction failed as expected:", {
  //     message: error.message,
  //     reason: error.reason,
  //     code: error.code
  //   });
  // }

  console.log("\n=== Attempting Supply With Venn SDK ===");
  try {
    // Initialize Venn client
    const vennURL = process.env.VENN_NODE_URL ?? "";
    const vennPolicyAddress = process.env.VENN_POLICY_ADDRESS ?? "";
    const vennClient = new VennClient({ vennURL, vennPolicyAddress });

    const txData = pool.interface.encodeFunctionData('supply', [
      usdc.address,
      supplyAmount,
      deployer.address,
      0
    ]);
    
    console.log("Requesting approval...");
    const approvedTransaction = await vennClient.approve({
      from: deployer.address,
      to: pool.address,
      data: txData,
      value: "0"
    });
    
    console.log("Sending transaction through Venn...");
    // Add explicit transaction parameters to bypass estimation
    const tx = await deployer.sendTransaction(approvedTransaction as any);

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction status:", receipt.status);
  } catch (error: any) {
    console.log("Venn SDK transaction failed as expected:", {
      message: error.message?.slice(0, 200), // Trim the long error message
      reason: error.reason,
      code: error.code
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });