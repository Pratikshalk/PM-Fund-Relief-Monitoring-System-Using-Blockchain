// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BeneficiaryVerification is Ownable {
    struct Application {
        string aadhaarIPFS;
        string lightBillIPFS;
        string incidentIPFS;
        uint verificationScore;
        bool isVerified;
        bool fundsDistributed;
    }
    
    mapping(address => Application) public applications;
    address[] public eligibleAddresses;
    uint public minimumVerificationScore = 70;
    
    event ApplicationSubmitted(address indexed applicant);
    event Verified(address indexed beneficiary, uint score);
    event VerificationThresholdUpdated(uint newThreshold);
    event FundsDistributed(address indexed beneficiary);

    constructor() Ownable(msg.sender) {}

    function submitApplication(
        string memory _aadhaarIPFS,
        string memory _lightBillIPFS,
        string memory _incidentIPFS
    ) external {
        require(bytes(_aadhaarIPFS).length > 0, "Aadhaar IPFS hash required");
        require(bytes(_lightBillIPFS).length > 0, "Light bill IPFS hash required");
        require(bytes(_incidentIPFS).length > 0, "Incident IPFS hash required");
        require(!applications[msg.sender].isVerified, "Already verified");
        
        applications[msg.sender] = Application({
            aadhaarIPFS: _aadhaarIPFS,
            lightBillIPFS: _lightBillIPFS,
            incidentIPFS: _incidentIPFS,
            verificationScore: 0,
            isVerified: false,
            fundsDistributed: false
        });
        
        emit ApplicationSubmitted(msg.sender);
    }

    function verifyBeneficiary(address _applicant, uint _score) external onlyOwner {
        require(_applicant != address(0), "Invalid address");
        require(!applications[_applicant].isVerified, "Already verified");
        require(_score >= minimumVerificationScore, "Score below threshold");
        require(bytes(applications[_applicant].aadhaarIPFS).length > 0, "No application found");
        
        applications[_applicant].verificationScore = _score;
        applications[_applicant].isVerified = true;
        eligibleAddresses.push(_applicant);
        
        emit Verified(_applicant, _score);
    }
    
    function markFundsDistributed(address _beneficiary) external onlyOwner {
        require(applications[_beneficiary].isVerified, "Not verified");
        require(!applications[_beneficiary].fundsDistributed, "Funds already distributed");
        
        applications[_beneficiary].fundsDistributed = true;
        emit FundsDistributed(_beneficiary);
    }

    function setVerificationThreshold(uint _newScore) external onlyOwner {
        require(_newScore > 0 && _newScore <= 100, "Invalid score range");
        minimumVerificationScore = _newScore;
        emit VerificationThresholdUpdated(_newScore);
    }

    function getEligibleCount() external view returns (uint) {
        return eligibleAddresses.length;
    }

    function isEligible(address _applicant) external view returns (bool) {
        return applications[_applicant].isVerified && 
               !applications[_applicant].fundsDistributed;
    }

    function getApplication(address _applicant) external view returns (
        string memory,
        string memory,
        string memory,
        uint,
        bool,
        bool
    ) {
        Application memory app = applications[_applicant];
        return (
            app.aadhaarIPFS,
            app.lightBillIPFS,
            app.incidentIPFS,
            app.verificationScore,
            app.isVerified,
            app.fundsDistributed
        );
    }

    function getEligibleAddresses() external view returns (address[] memory) {
        return eligibleAddresses;
    }
}