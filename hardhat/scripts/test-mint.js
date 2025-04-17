// scripts/fund-and-mint.js
const { ethers } = require("ethers");
require("dotenv").config({ path: ".env" });

const RPC_URL          = "https://sepolia.drpc.org";
const PRIVATE_KEY      = process.env.ETH_PRIVATE_KEY;
const CONTRACT_ADDRESS = "0x373328Bc994f7c1a5a5B78f29Ed31BD21DbCb630";
const LINK_TOKEN       = "0x779877A7B0D9E8603169DdbD7836e478b4624789";

// ABI minimal per LINK ERC‑20
const linkAbi = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)"
];

// ABI minimal per il tuo contratto
const contractAbi = [
  "function requestMint() public returns (uint256)"
];

async function main() {
  // 1) provider + wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet   = new ethers.Wallet(PRIVATE_KEY, provider);

  // 2) istanze dei contratti
  const link     = new ethers.Contract(LINK_TOKEN, linkAbi, wallet);
  const nft      = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, wallet);

  // 3) controlla LINK nel wallet
// 3) controlla LINK nel wallet
    const bal = await link.balanceOf(wallet.address);
    console.log("🔹 Wallet LINK balance:", ethers.formatEther(bal));
    // ethers.parseEther("1") è anche un BigInt
    if (bal < ethers.parseEther("1")) {
    throw new Error("❌ Serve almeno 1 LINK nel wallet per fundare il contratto");
    }


  // 4) fund del contratto
  console.log("🔹 Funding contract with 1 LINK...");
  const fundTx = await link.transfer(CONTRACT_ADDRESS, ethers.parseEther("1"));
  await fundTx.wait();
  console.log("✅ Contract funded");

  // 5) chiama requestMint()
  console.log("🔹 Calling requestMint()...");
  const tx = await nft.requestMint();
  console.log("→ Tx hash:", tx.hash);
  await tx.wait();
  console.log("✅ requestMint() succeeded — attendi il callback di Chainlink");
}

main().catch((err) => {
  console.error("❌ Errore:", err);
  process.exit(1);
});
