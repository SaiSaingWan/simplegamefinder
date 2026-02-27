import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC9N66yRHuh4uv6n_g6LkUjUVo-aBy0Xak",
  // Ensure these match the NEW project details in your console:
  authDomain: "simplegamefinder084.firebaseapp.com", 
  projectId: "simplegamefinder084",                 
  storageBucket: "simplegamefinder084.firebasestorage.app",
  messagingSenderId: "35902992269",
  appId: "1:35902992269:web:17c68e6bb981121b6d57c4",
  measurementId: "G-Y54TMBFYRC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export these so your App.jsx and Screens can use them
export const auth = getAuth(app);
export const db = getFirestore(app);