const { ethers } = require("hardhat");

async function main() {
  // Get a different account each time by using a different index
  const [deployer] = await ethers.getSigners(); // Using second account
  console.log("Deploying contracts with the account:", deployer.address);

  const contractName = await ethers.getContractFactory("BettingStandalone", deployer);
  const subId = 37938025641463273327017539264192639882875758512794766117505911909709055839656;
  const contract = await contractName.deploy(subId);
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("Contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//npx hardhat run scripts/deploy.js --network sepolia

/**
 *
Tipo	Indirizzo
LINK Token	0x779877A7B0D9E8603169DdbD7836e478b4624789
VRF Wrapper	0x708701a1DfF4f478de54383E49a627eD4852C816 
 */
