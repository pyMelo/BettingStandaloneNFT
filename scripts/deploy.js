const { ethers } = require("hardhat");
const path = require("path");
const rawCids = require("../metadata/metadata-cids.json");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function main() {
  // Get a different account each time by using a different index
  const [deployer] = await ethers.getSigners(); // Using second account
  console.log("Deploying contracts with the account:", deployer.address);
  const SUBSCRIPTION_ID = process.env.SUB_ID; 
  const VRF_COORDINATOR_ADDRESS = process.env.COORDINATOR_ADDRESS; // Sepolia
  const KEY_HASH = process.env.KEY_HASH; // Sepolia 0.1 gwei lane

  const metadataURIs = rawCids.map(cid => `ipfs://${cid}`);


  const Betting = await ethers.getContractFactory("BettingStandalone", deployer);
  const contract = await Betting.deploy(        // token symbol
    metadataURIs             // the array of full URIs
  );
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("Contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});