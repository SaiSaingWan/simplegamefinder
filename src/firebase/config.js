import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD7Y56LQ_6XVaByxNvXLahkdZGvOU6naHk",
  authDomain: "simplegamefinder3084.firebaseapp.com",
  projectId: "simplegamefinder3084",
  storageBucket: "simplegamefinder3084.firebasestorage.app",
  messagingSenderId: "617678283192",
  appId: "1:617678283192:web:45936c39b50a06669d6f4d",
  measurementId: "G-TTFDFWFDV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// EXPORTS: Critical for your screens to work!
export const auth = getAuth(app);
export const db = getFirestore(app);