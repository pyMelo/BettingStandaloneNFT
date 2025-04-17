const LINK_TOKEN  = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
const CONTRACT_ADDRESS = "0x373328Bc994f7c1a5a5B78f29Ed31BD21DbCb630";

// ABI minimal per LINK ERC‑20
const linkAbi = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)"
];
const provider = new ethers.JsonRpcProvider("https://sepolia.drpc.org");
const wallet   = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);
const link     = new ethers.Contract(LINK_TOKEN, linkAbi, wallet);

// 1) Controlla il tuo bilancio LINK
let bal = await link.balanceOf(wallet.address);
console.log("Wallet LINK balance:", ethers.formatEther(bal));
if (bal.lt(ethers.parseEther("1"))) {
  throw new Error("Non hai abbastanza LINK sul wallet per fundare il contratto");
}

// 2) Esegui il transfer verso il contratto
const fundTx = await link.transfer(CONTRACT_ADDRESS, ethers.parseEther("1"));
await fundTx.wait();
console.log("✅ Contratto funded con 1 LINK");
