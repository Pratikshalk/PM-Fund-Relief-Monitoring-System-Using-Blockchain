import axios from 'axios';

export const verifyDocuments = async (ipfsHashes) => {
  // Call your verification service/AI model
  const response = await axios.post('https://your-verification-api.com/verify', {
    aadhaar: ipfsHashes.aadhaarIPFS,
    lightBill: ipfsHashes.lightBillIPFS,
    incident: ipfsHashes.incidentIPFS
  });
  
  return {
    score: response.data.score,
    details: response.data.details
  };
};

export const submitToBlockchain = async (formData, contract) => {
  const tx = await contract.submitApplication(
    formData.aadhaarIPFS,
    formData.lightBillIPFS,
    formData.incidentIPFS
  );
  await tx.wait();
  return tx.hash;
};