import { ethers } from "hardhat";

async function main() {
  const policyAddress = "0x7Ec60768E1C4322d388dC6ca55C8DD2f1750c6fC";
  
  const signer = await ethers.provider.getSigner();
  const signerAddress = await signer.getAddress();

  const policyContract = await ethers.getContractAt(
    [
      "function SIGNER_ROLE() external view returns (bytes32)",
      "function grantRole(bytes32 role, address account) external"
    ],
    policyAddress
  );

  // Get the SIGNER_ROLE bytes32 value
  const signerRole = await policyContract.SIGNER_ROLE();
  console.log("SIGNER_ROLE:", signerRole);

  // Grant the role to yourself (or any other address)
  const tx = await policyContract.grantRole(signerRole, signerAddress);
  await tx.wait();
  
  console.log(`Granted SIGNER_ROLE to ${signerAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);