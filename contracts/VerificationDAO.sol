// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VerificationDAO is Ownable {
    struct Vote {
        address voter;
        bool approved;
    }
    
    mapping(address => mapping(address => bool)) public votes;
    mapping(address => uint) public approvalCounts;
    address[] public validators;
    uint public requiredApprovals = 3;
    
    constructor() Ownable(msg.sender) {
        validators.push(msg.sender);
    }
    
    function addValidator(address _validator) external onlyOwner {
        validators.push(_validator);
    }
    
    function voteForApproval(address _beneficiary, bool _approve) external {
        require(isValidator(msg.sender), "Not a validator");
        
        if (!votes[_beneficiary][msg.sender]) {
            votes[_beneficiary][msg.sender] = true;
            if (_approve) {
                approvalCounts[_beneficiary] += 1;
            }
        }
    }
    
    function isApproved(address _beneficiary) public view returns (bool) {
        return approvalCounts[_beneficiary] >= requiredApprovals;
    }
    
    function isValidator(address _address) public view returns (bool) {
        for (uint i = 0; i < validators.length; i++) {
            if (validators[i] == _address) {
                return true;
            }
        }
        return false;
    }
}