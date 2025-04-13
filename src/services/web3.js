// import Web3 from "web3";
// import contractABI from "../abi.json"; // ✅ Import the ABI file

// // ✅ Connect to MetaMask or any Ethereum provider
// const web3 = new Web3(window.ethereum);


// // ✅ Replace this with your actual deployed contract address
// const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// // ✅ Initialize the smart contract with ABI & address
// const donationContract = new web3.eth.Contract(contractABI.abi, contractAddress);

// // ✅ Request user to connect their wallet (MetaMask)
// export async function connectWallet() {
//   try {
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     console.log("Wallet connected successfully");
//   } catch (error) {
//     console.error("Error connecting wallet:", error);
//   }
// }

// // export { web3, donationContract };
// export const getWeb3 = () => web3;

import Web3 from "web3";
import contractABI from "../abi.json";

// Initialize with fallback provider
let web3;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x8cA32521F565946A163eB8e7116e5561aCdd1229";

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    console.error("User denied access:", error);
  }
} else {
  console.warn("MetaMask not detected. Using read-only Infura.");
  web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY"));
}

const donationContract = new web3.eth.Contract(contractABI.abi, contractAddress);

// Fetch eligibility status
export const checkEligibility = async (address) => {
  return await donationContract.methods.isEligible(address).call();
};

export { web3, donationContract };