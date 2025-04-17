const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const contractName = await ethers.getContractFactory("BettingStandalone", deployer);
  const linkToken = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
  const vrfWrapper = "0x708701a1DfF4f478de54383E49a627eD4852C816";

  // Usa direttamente l'ABI invece di cercare l'interfaccia
  const linkAbi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address) view returns (uint256)"
  ];
  
  // Usa Contract constructor invece di getContractAt
  const link = new ethers.Contract(linkToken, linkAbi, deployer);
  
  const tx = await link.approve(vrfWrapper, ethers.parseEther("1"));
  await tx.wait();
  console.log("LINK Approved for VRF Wrapper");

  const contract = await contractName.deploy(linkToken, vrfWrapper);
  await contract.waitForDeployment();

  const network = await deployer.provider.getNetwork();
  console.log(`Network: ${network.name} (${network.chainId})`);

  const address = await contract.getAddress();
  console.log("Contract deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});