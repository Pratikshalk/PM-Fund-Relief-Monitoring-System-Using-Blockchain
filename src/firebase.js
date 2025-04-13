// import firebase from "firebase/compat/app";
// import 'firebase/auth';
// import 'firebase/compat/firestore';
// import { getAuth } from 'firebase/auth';


// const firebaseConfig = {
//   apiKey: "AIzaSyBC5D17S7gNHVgcWb9mY9OirQVX3SgVeAI",
//   authDomain: "registration-form-6a2c1.firebaseapp.com",
//   projectId: "registration-form-6a2c1",
//   storageBucket: "registration-form-6a2c1.firebasestorage.app",
//   messagingSenderId: "422441456107",
//   appId: "1:422441456107:web:580b51596af0cb378c89ae"
// };

// // Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// // export const db = firebase.firestore();
// export const auth=getAuth(app);
// export const db = firebase.firestore();
// auth.languageCode = 'it';

import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBC5D17S7gNHVgcWb9mY9OirQVX3SgVeAI",
  authDomain: "registration-form-6a2c1.firebaseapp.com",
  projectId: "registration-form-6a2c1",
  storageBucket: "registration-form-6a2c1.appspot.com",
  messagingSenderId: "422441456107",
  appId: "1:422441456107:web:580b51596af0cb378c89ae",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ Export Firebase Auth instance
export const db = getFirestore(app);
