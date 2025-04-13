// import React, { useEffect, useState } from 'react';
// import Navbar from './navbar'; // Import Navbar
// import '../assets/navbar.css'; // Navbar styles
// import '../assets/home.css'; // Home styles
// import BannerBackground from "../assets/home-banner-background.png";
// import BannerImage from "../assets/home-banner-image.png";
// import { useNavigate } from 'react-router-dom';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';  // Modular Firestore imports
// import { db } from '../firebase';  // Assuming db is initialized in firebase.js

// function Home() {
//     const navigate = useNavigate();
//     const [isVerified, setIsVerified] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const firestore = getFirestore();  // Get Firestore instance

//     useEffect(() => {
//         const checkVerificationStatus = async () => {
//             const walletAddress = localStorage.getItem('walletAddress');  // Retrieve wallet address
//             if (walletAddress) {
//                 const userRef = doc(firestore, 'users', walletAddress);  // Use modular Firestore method
//                 const docSnap = await getDoc(userRef);

//                 if (docSnap.exists()) {
//                     setIsVerified(docSnap.data().otpVerified);  // Check if user is verified
//                 } else {
//                     console.log("No such document!");
//                 }
//             }
//             setLoading(false);
//         };

//         checkVerificationStatus();
//     }, [firestore]);

//     const handleDonateClick = () => {
//         if (!isVerified) {
//             navigate('/eKYCForm');  // Redirect to eKYC form if not verified
//         } else {
//             navigate('/Form');  // Proceed to donation form if verified
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="home">
//             <div className="nav-links">
//                 <Navbar />
//             </div>
//             <div className="home-banner-container">
//                 <div className="home-bannerImage-container">
//                     <img src={BannerBackground} alt="background" />
//                 </div>
//                 <div className="home-text-section">
//                     <h1 className="primary-heading">
//                         MAKE SOMEONE'S LIFE BY GIVING OF YOURS
//                     </h1>
//                     <p className="primary-text">
//                         Join hands with millions across the nation to uplift lives and bring a brighter future to those who need it most
//                     </p>
//                     <button className="secondary-button" onClick={handleDonateClick}>
//                         {isVerified ? 'Donate Now' : 'Complete eKYC'}
//                     </button>
//                 </div>
//                 <div className="home-image-section">
//                     <img src={BannerImage} alt="banner" />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Home;

import React from 'react';
import Navbar from './navbar'; // Import Navbar
import '../assets/navbar.css'; // Navbar styles
import '../assets/home.css'; // Home styles
import BannerBackground from "../assets/home-banner-background.png";
import BannerImage from "../assets/home-banner-image.png";
import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();  // Initialize the navigate function
  
    const handleDonateClick = () => {
      navigate('/Form');  // Navigate to the donate page when the button is clicked
    };

    return (
        <div className="home">
          <div className="nav-links"> 
              <Navbar />
          </div> 
          <div className="home-banner-container">
            <div className="home-bannerImage-container">
              <img src={BannerBackground} alt="background" />
            </div>
            <div className="home-text-section">
            <h1 className="primary-heading">
            MAKE SOMEONE'S LIFE BY GIVING OF YOURS
            </h1>
            <p className="primary-text">
            Joins hands with millions across the nation to uplift lives and bring a brighter future to those who need it most
            </p>
            <button className="secondary-button"onClick={handleDonateClick}>
            Donate Now
            </button>
            </div>
            <div className="home-image-section">
            <img src={BannerImage} alt="banner" />
            </div>
          </div>

        </div>
    );
}

export default Home;