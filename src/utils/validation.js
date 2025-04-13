// Validate IFSC with error messaging
export const validateIFSC = (ifsc) => {
    const cleanedIFSC = ifsc.toUpperCase().trim();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanedIFSC)) {
      throw new Error(
        "Invalid IFSC. Format: 4 letters + 0 + 6 alphanumeric (e.g., SBIN0001234)"
      );
    }
    return true;
  };
  
  // Ethereum address validation
  export const validateEthAddress = (address) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error("Invalid Ethereum address");
    }
    return true;
  };