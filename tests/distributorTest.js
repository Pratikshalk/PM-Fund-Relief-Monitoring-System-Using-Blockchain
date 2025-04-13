it("Should send funds to eligible beneficiary", async () => {
    // 1. Mark as eligible
    await verification.markEligible(beneficiary, { from: admin });
    
    // 2. Add funds
    await distributor.addFunds(beneficiary, { 
        from: admin, 
        value: web3.utils.toWei("1", "ether") 
    });
    
    // 3. Distribute
    const tx = await distributor.distributeFunds(beneficiary, { from: admin });
    
    // Verify
    const balance = await web3.eth.getBalance(beneficiary);
    assert(balance > 0, "Funds not received");
});