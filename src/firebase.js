// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7Y56LQ_6XVaByxNvXLahkdZGvOU6naHk",
  authDomain: "simplegamefinder3084.firebaseapp.com",
  projectId: "simplegamefinder3084",
  storageBucket: "simplegamefinder3084.firebasestorage.app",
  messagingSenderId: "617678283192",
  appId: "1:617678283192:web:45936c39b50a06669d6f4d",
  measurementId: "G-TTFDFWFDV2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();