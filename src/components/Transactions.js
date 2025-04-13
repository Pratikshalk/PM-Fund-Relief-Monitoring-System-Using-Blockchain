import React, { useEffect, useState } from "react";
import { web3, donationContract } from "../services/web3";


const Transactions = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    async function fetchDonations() {
      try {
        if (!donationContract) {
          console.error("Smart contract is not loaded.");
          return;
        }

        const donationData = await donationContract.methods.getDonationsHistory().call();
        
        if (!donationData || donationData.length === 0) {
          console.warn("No transactions found.");
          setDonations([]);
          return;
        }

        const formattedDonations = donationData.map((donation) => ({
          donor: donation.donor,
          amount: web3.utils.fromWei(donation.amount.toString(), "ether"),
          timestamp: new Date(Number(donation.timestamp) * 1000).toLocaleString(),
        }));

        setDonations(formattedDonations);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchDonations();
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      {donations.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Donor Address</th>
              <th>Amount (ETH)</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index}>
                <td>{donation.donor}</td>
                <td>{donation.amount}</td>
                <td>{donation.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
