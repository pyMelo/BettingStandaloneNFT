require("dotenv").config({path: "../.env"});
const { ethers } = require("ethers");

async function main() {
    const RPC_URL = process.env.RPC_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;  

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log("Wallet address:", wallet.address);

    const ABI = [
        "function mint() external",
        "event Minted(address indexed to, uint256 indexed tokenId, uint8 rarity, uint8 trait)"
    ];
    


      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  // ─── Listen for the Minted event ───────────────────────────────
  contract.on("Minted", (to, tokenId, rarity, trait) => {
    console.log(`🎉 NFT Minted!
  • to:       ${to}
  • tokenId:  ${tokenId.toString()}
  • rarity:   ${rarity}
  • trait:    ${trait}`);
    process.exit(0);
  });

  // ─── Send the mint transaction ─────────────────────────────────
  console.log("🚀 Sending mint()…");
  const tx = await contract.mint({ gasLimit: 500_000 });
  console.log("→ tx hash:", tx.hash);
  await tx.wait();
  console.log("⏳ Waiting for Minted event…");
}

main().catch(err => {
  console.error("❌ Error in interact.js:", err);
  process.exit(1);
});
