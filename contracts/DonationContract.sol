
// pragma solidity ^0.8.28;

// contract DonationContract {
//     address public owner;
//     mapping(address => uint) public donations;

//     constructor() {
//         owner = msg.sender;
//     }

//     function donate() public payable {
//         require(msg.value > 0, "Donation must be greater than 0");
//         donations[msg.sender] += msg.value;
//     }

//     function withdraw() public {
//         require(msg.sender == owner, "Only owner can withdraw");
//         payable(owner).transfer(address(this).balance);
//     }

//     function getBalance() public view returns (uint) {
//         return address(this).balance;
//     }
// }


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationContract is Ownable {
    struct Donation {
        address donor;
        uint amount;
        uint timestamp;
    }

    Donation[] public donationHistory;
    mapping(address => uint) public donorTotals;
    address public distributor;  // AutoDistributor address
    
    event DonationReceived(address indexed donor, uint amount);
    event FundsForwarded(uint totalAmount);

    constructor(address _distributor) Ownable(msg.sender) {
        distributor = _distributor;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");
        
        // Record donation
        donorTotals[msg.sender] += msg.value;
        donationHistory.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        emit DonationReceived(msg.sender, msg.value);
        
        // Immediately forward to distributor
        (bool success, ) = distributor.call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    // Modified withdraw function (emergency only)
    function emergencyWithdraw() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds available");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Update distributor address (e.g., if AutoDistributor upgrades)
    function setDistributor(address _newDistributor) public onlyOwner {
        require(_newDistributor != address(0), "Invalid address");
        distributor = _newDistributor;
    }

    // View functions (unchanged)
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getDonationCount() public view returns (uint) {
        return donationHistory.length;
    }

    function getDonationsHistory() public view returns (Donation[] memory) {
        return donationHistory;
    }
}
