const Distributor = artifacts.require("AutoDistributor");
const Verification = artifacts.require("BeneficiaryVerification");

contract("Distribution Test", (accounts) => {
  it("should send ETH automatically", async () => {
    // 1. Get contracts
    const verification = await Verification.deployed();
    const distributor = await Distributor.deployed();
    
    // 2. Set test accounts
    const admin = accounts[0];
    const beneficiary = accounts[1];

    // 3. Mark beneficiary as eligible
    await verification.markEligible(beneficiary, { from: admin });

    // 4. Fund the distributor (send 1 ETH)
    await web3.eth.sendTransaction({
      from: admin,
      to: distributor.address,
      value: web3.utils.toWei("1", "ether")
    });

    // 5. Trigger distribution
    const tx = await distributor.distributeFunds(beneficiary, { from: admin });
    console.log("TX Hash:", tx.tx);

    // 6. Verify
    const balance = await web3.eth.getBalance(beneficiary);
    console.log("Beneficiary balance:", web3.utils.fromWei(balance, "ether"), "ETH");
  });
});