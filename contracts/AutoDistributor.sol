// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BeneficiaryVerification.sol";

contract AutoDistributor is Ownable {
    // 1. State Variables
    BeneficiaryVerification public verificationContract;
    
    struct BeneficiaryFunds {
        uint256 allocatedAmount;
        bool isDistributed; // Consistent naming
    }
    
    mapping(address => BeneficiaryFunds) public beneficiaries;
    uint256 public totalFunds;
    uint256 public distributedFunds;
    
    // 2. Events
    event FundsAdded(address indexed donor, uint256 amount);
    event FundsDistributed(address indexed beneficiary, uint256 amount);
    event EmergencyWithdraw(address indexed owner, uint256 amount);
    event VerificationContractUpdated(address newContract);

    // 3. Constructor
    constructor(address _verificationAddress) Ownable(msg.sender) {
        verificationContract = BeneficiaryVerification(_verificationAddress);
    }

    // 4. Core Functions
    function addFunds(address beneficiary) external payable {
        require(msg.value > 0, "Must send ETH");
        require(verificationContract.isEligible(beneficiary), "Beneficiary not eligible");
        
        beneficiaries[beneficiary].allocatedAmount += msg.value;
        totalFunds += msg.value;
        
        emit FundsAdded(msg.sender, msg.value);
    }

    function distributeFunds(address beneficiary) external {
        require(verificationContract.isEligible(beneficiary), "Not currently eligible");
        require(beneficiaries[beneficiary].allocatedAmount > 0, "No funds allocated");
        require(!beneficiaries[beneficiary].isDistributed, "Funds already distributed"); // Fixed here
        
        uint256 amount = beneficiaries[beneficiary].allocatedAmount;
        
        // Update state before transfer (reentrancy protection)
        beneficiaries[beneficiary].isDistributed = true; // Fixed here
        distributedFunds += amount;
        
        // Transfer funds
        (bool success, ) = payable(beneficiary).call{value: amount}("");
        require(success, "Transfer failed");
        
        // Mark as distributed in verification contract
        verificationContract.markFundsDistributed(beneficiary);
        
        emit FundsDistributed(beneficiary, amount);
    }

    // 5. Admin functions
    function batchDistribute(address[] calldata beneficiariesToDistribute) external onlyOwner {
        for (uint i = 0; i < beneficiariesToDistribute.length; i++) {
            address beneficiary = beneficiariesToDistribute[i];
            if (verificationContract.isEligible(beneficiary) && 
                beneficiaries[beneficiary].allocatedAmount > 0 &&
                !beneficiaries[beneficiary].isDistributed) {
                distributeFunds(beneficiary);
            }
        }
    }
    function updateVerificationContract(address _newVerificationContract) external onlyOwner {
        require(_newVerificationContract != address(0), "Invalid address");
        verificationContract = BeneficiaryVerification(_newVerificationContract);
        emit VerificationContractUpdated(_newVerificationContract);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit EmergencyWithdraw(owner(), balance);
    }

    // 6. Helper Functions
    function getAvailableFunds() public view returns (uint256) {
        return address(this).balance;
    }

    function getBeneficiaryStatus(address beneficiary) external view returns (
        uint256 allocated,
        bool isEligible,
        bool isDistributed
    ) {
        return (
            beneficiaries[beneficiary].allocatedAmount,
            verificationContract.isEligible(beneficiary),
            beneficiaries[beneficiary].isDistributed
        );
    }

    receive() external payable {
        totalFunds += msg.value;
        emit FundsAdded(msg.sender, msg.value);
}
}