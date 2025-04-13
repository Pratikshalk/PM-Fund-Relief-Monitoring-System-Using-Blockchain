const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy Verification
  const Verification = await ethers.getContractFactory("BeneficiaryVerification");
  const verification = await Verification.deploy();
  await verification.deployed();
  
  // Deploy Distributor
  const Distributor = await ethers.getContractFactory("AutoDistributor");
  const distributor = await Distributor.deploy(verification.address);
  await distributor.deployed();

  console.log("Verification deployed to:", verification.address);
  console.log("Distributor deployed to:", distributor.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });