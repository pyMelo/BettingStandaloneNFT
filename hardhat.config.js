require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });


module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.gateway.tenderly.co",
      accounts: [process.env.PRIVATE_KEY],
    },
    iota: {
      url: "https://json-rpc.evm.testnet.iotaledger.net",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
  },
};
