import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Added this
import { getFirestore } from "firebase/firestore"; // Added this
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBgQvMmslvGEdssICr6FLkCVz6p6aV6zIc",
  authDomain: "simplegamefinder.firebaseapp.com",
  projectId: "simplegamefinder",
  storageBucket: "simplegamefinder.firebasestorage.app",
  messagingSenderId: "35902992269",
  appId: "1:35902992269:web:d4204bea4de2634f6d57c4",
  measurementId: "G-K4KC8B2N69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// THIS IS WHAT YOUR LOGIN SCREEN IS LOOKING FOR:
export const auth = getAuth(app); 
export const db = getFirestore(app);