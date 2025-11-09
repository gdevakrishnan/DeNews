const { ethers } = require("hardhat");

async function main() {
    const DeNews = await ethers.getContractFactory("DeNews");
    const deNews = await DeNews.deploy();

    await deNews.waitForDeployment();
    
    console.log("DeNews Contract Deployed at:", await deNews.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
