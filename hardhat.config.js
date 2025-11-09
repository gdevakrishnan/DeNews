require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const {ALCHEMY_URL, PRIVATE_KEY, L1X_PRIVATE_KEY} = process.env;
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `${ALCHEMY_URL}`,
      accounts: [PRIVATE_KEY],
    },
    l1xTestnet: {
      url: "https://v2-testnet-rpc.l1x.foundation/",
      accounts: [L1X_PRIVATE_KEY],
    },
  },
};