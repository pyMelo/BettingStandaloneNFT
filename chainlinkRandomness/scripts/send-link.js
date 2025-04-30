const { ethers } = require("ethers");
require("dotenv").config();

async function fund() {
  const provider = new ethers.JsonRpcProvider("https://sepolia.drpc.org");
  const wallet   = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);
  const LINK     = process.env.LINK;
  const CONTRACT = process.env.CONTRACT_ADDRESS ; // your contract

  const linkAbi = [
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address owner) view returns (uint256)"
  ];
  const link = new ethers.Contract(LINK, linkAbi, wallet);

  const bal = await link.balanceOf(wallet.address);
  console.log("Your LINK balance:", ethers.formatEther(bal));
  if (bal < ethers.parseEther("1")) {
    throw new Error("You need at least 1 LINK to fund the contract");
  }

  console.log("Funding contract with 1 LINK...");
  const tx = await link.transfer(CONTRACT, ethers.parseEther("1"));
  await tx.wait();
  console.log("✅ Contract funded");
}

fund().catch(console.error);
