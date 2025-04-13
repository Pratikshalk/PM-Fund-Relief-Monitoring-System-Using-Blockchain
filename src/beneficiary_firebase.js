// Import Firebase SDK
    // apiKey: "AIzaSyDT1a4shuHXyhroKsFwSVS13iY6-Hq-6vw",
    // authDomain: "beneficiaryform.firebaseapp.com",
    // projectId: "beneficiaryform",
    // storageBucket: "beneficiaryform.firebasestorage.app",
    // messagingSenderId: "302350427943",
    // appId: "1:302350427943:web:1f676d70c9f78e112bab02"

// Import Firebase dependencies
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: "beneficiaryform.firebaseapp.com",
//     projectId: "beneficiaryform",
//     storageBucket: "beneficiaryform.appspot.com",
//     messagingSenderId: "302350427943",
//     appId: "1:302350427943:web:1f676d70c9f78e112bab02"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// export { db, auth };


// Import Firebase dependencies
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: "beneficiaryform.firebaseapp.com",
//     projectId: "beneficiaryform",
//     storageBucket: "beneficiaryform.appspot.com",
//     messagingSenderId: "302350427943",
//     appId: "1:302350427943:web:1f676d70c9f78e112bab02"
// };

// // ✅ Ensure Firebase is only initialized once
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// console.log("Firebase initialized successfully");
// export { db, auth };



import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ensure .env variables are correctly set
if (!process.env.REACT_APP_FIREBASE_API_KEY) {
    console.error("❌ Firebase API Key is missing in .env file");
}

const firebaseConfig = {
    apiKey: "REACT_APP_FIREBASE_API_KEY",
    authDomain: "newbeneficiaryform.firebaseapp.com",
    projectId: "newbeneficiaryform",
    storageBucket: "newbeneficiaryform.firebasestorage.app",
    messagingSenderId: "384974716180",
    appId: "1:384974716180:web:fd864c757a153df8831601"
 
};

// ✅ Ensure Firebase is only initialized once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

console.log("✅ Firebase initialized successfully");
export { app, auth, db};

