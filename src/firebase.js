// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgQvMmslvGEdssICr6FLkCVz6p6aV6zIc",
  authDomain: "simplegamefinder.firebaseapp.com",
  projectId: "simplegamefinder",
  storageBucket: "simplegamefinder.firebasestorage.app",
  messagingSenderId: "35902992269",
  appId: "1:35902992269:web:d4204bea4de2634f6d57c4",
  measurementId: "G-K4KC8B2N69"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // THIS MUST BE HERE