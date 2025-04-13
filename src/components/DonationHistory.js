import React, { useEffect, useState } from "react";
import { web3, donationContract } from "../web3";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    async function fetchDonations() {
      try {
        const donationData = await donationContract.methods.getDonationsHistory().call();
        
        const formattedDonations = donationData.map(donation => ({
          donor: donation.donor,
          amount: web3.utils.fromWei(donation.amount.toString(), "ether"),
          timestamp: new Date(Number(donation.timestamp) * 1000).toLocaleString()
        }));

        setDonations(formattedDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    }

    fetchDonations();
  }, []);

  return (
    <div>
      <h2>Donation History</h2>
      <ul>
        {donations.length === 0 ? (
          <p>No donations yet.</p>
        ) : (
          donations.map((donation, index) => (
            <li key={index}>
              <strong>Donor:</strong> {donation.donor} <br />
              <strong>Amount:</strong> {donation.amount} ETH <br />
              <strong>Time:</strong> {donation.timestamp}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DonationHistory;
