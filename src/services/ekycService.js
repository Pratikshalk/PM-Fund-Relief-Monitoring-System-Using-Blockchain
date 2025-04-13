import { db } from '../firebase';  // Correct import for named export db

export const verifyAadhaar = async (aadhaarNumber, otp, walletAddress) => {
  try {
    if (aadhaarNumber === '1234-5678-9876' && otp === '123456') {
      // Store the user's verification status in Firebase
      const userRef = db.collection('users').doc(walletAddress);
      await userRef.set({
        aadhaarNumber,
        otpVerified: true,
        verifiedAt: new Date()
      });

      return { success: true, message: 'eKYC Verified!' };
    } else {
      return { success: false, message: 'Verification Failed.' };
    }
  } catch (error) {
    console.error("Error during eKYC verification:", error);
    return { success: false, message: 'Server Error.' };
  }
};
