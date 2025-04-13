const DonationContract = artifacts.require("DonationContract");
const BeneficiaryVerification = artifacts.require("BeneficiaryVerification");
const AutoDistributor = artifacts.require("AutoDistributor");
const VerificationDAO = artifacts.require("VerificationDAO");

module.exports = async function (deployer, network, accounts) {
  // 1. Deploy Verification DAO
  await deployer.deploy(VerificationDAO);
  const dao = await VerificationDAO.deployed();

  // 2. Deploy Beneficiary Verification
  await deployer.deploy(BeneficiaryVerification);
  const verification = await BeneficiaryVerification.deployed();

  // 3. Deploy Auto Distributor
  await deployer.deploy(AutoDistributor, verification.address);
  const distributor = await AutoDistributor.deployed();

  // 4. Transfer verification ownership to distributor
  await verification.transferOwnership(distributor.address);

  // 5. Deploy Donation Contract
  await deployer.deploy(DonationContract, distributor.address);
  const donation = await DonationContract.deployed();

  // 6. Setup test validators (development/sepolia only)
  if (network === 'development' || network === 'sepolia') {
    for (let i = 0; i < 3; i++) {
      await dao.addValidator(accounts[i], { from: accounts[0] });
    }
  }

  console.log("DAO:", dao.address);
  console.log("Verification:", verification.address);
  console.log("Distributor:", distributor.address);
  console.log("Donation:", donation.address);
};