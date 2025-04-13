// // src/utils/bankAPI.js
// import axios from 'axios';

// /**
//  * Fetches bank details using multiple fallback APIs
//  * @param {string} ifsc - 11-character IFSC code
//  * @returns {Promise<{bank: string, branch: string}>}
//  */
// export const fetchBankDetails = async (ifsc) => {
//   // Primary API - Razorpay
//   try {
//     const razorpayResponse = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
//     if (razorpayResponse.data?.BANK) {
//       return {
//         bank: razorpayResponse.data.BANK,
//         branch: razorpayResponse.data.BRANCH,
//         source: 'Razorpay'
//       };
//     }
//   } catch (error) {
//     console.warn('Razorpay API failed, trying fallback...');
//   }

//   // Fallback 1 - BankApis
//   try {
//     const bankApisResponse = await axios.get(
//       `https://bank-apis.justinclicks.com/API/V1/IFSC/${ifsc}/`,
//       { timeout: 3000 } // 3s timeout
//     );
//     if (bankApisResponse.data?.bank) {
//       return {
//         bank: bankApisResponse.data.bank,
//         branch: bankApisResponse.data.branch || bankApisResponse.data.address,
//         source: 'BankApis'
//       };
//     }
//   } catch (error) {
//     console.warn('BankApis failed, trying next fallback...');
//   }

//   // Fallback 2 - IFSC API
//   try {
//     const ifscApiResponse = await axios.get(
//       `https://ifsc.api.saralify.com/api/v1/${ifsc}`,
//       { headers: { 'Authorization': 'Bearer YOUR_API_KEY' } }
//     );
//     if (ifscApiResponse.data?.data?.bank) {
//       return {
//         bank: ifscApiResponse.data.data.bank,
//         branch: ifscApiResponse.data.data.branch,
//         source: 'IFSC API'
//       };
//     }
//   } catch (error) {
//     console.warn('IFSC API failed');
//   }

//   // If all APIs fail
//   throw new Error('All bank API attempts failed');
// };

// /**
//  * Cached version with localStorage
//  */
// export const fetchBankDetailsCached = async (ifsc) => {
//   const cacheKey = `ifsc_${ifsc}`;
  
//   // Check cache first
//   const cached = localStorage.getItem(cacheKey);
//   if (cached) {
//     return JSON.parse(cached);
//   }

//   // Fetch fresh data
//   const result = await fetchBankDetails(ifsc);
  
//   // Cache for 30 days
//   localStorage.setItem(cacheKey, JSON.stringify({
//     ...result,
//     cachedAt: new Date().toISOString()
//   }));

//   return result;
// };

// src/utils/bankAPI.js
// src/utils/bankAPI.js
import axios from 'axios';

export const fetchBankDetails = async (ifsc) => {
  try {
    // Try Razorpay API first
    const razorpayResponse = await axios.get(`https://ifsc.razorpay.com/${ifsc}`, {
      timeout: 3000 // 3 second timeout
    });
    
    if (razorpayResponse.data?.BANK) {
      return {
        bank: razorpayResponse.data.BANK,
        branch: razorpayResponse.data.BRANCH || razorpayResponse.data.ADDRESS || 'Branch not specified',
        source: 'Razorpay'
      };
    }
  } catch (error) {
    console.warn('Razorpay API failed:', error.message);
  }

  // Fallback to BankApis
  try {
    const bankApisResponse = await axios.get(
      `https://bank-apis.justinclicks.com/API/V1/IFSC/${ifsc}/`,
      { timeout: 3000 }
    );
    
    if (bankApisResponse.data?.bank) {
      return {
        bank: bankApisResponse.data.bank,
        branch: bankApisResponse.data.branch || bankApisResponse.data.address || 'Branch not specified',
        source: 'BankApis'
      };
    }
  } catch (error) {
    console.warn('BankApis failed:', error.message);
  }

  throw new Error('All bank API attempts failed');
};