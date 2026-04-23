import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// THIS IS THE MISSING PART - MAKE SURE THIS IS AT THE BOTTOM
export const saveGameToUserLibrary = async (game) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  return await addDoc(collection(db, "savedGames"), {
    gameId: game.id,
    userId: user.uid, 
    name: game.name,
    image: game.background_image,
    rating: game.rating,
    status: "Backlog",
    savedAt: serverTimestamp(),
  });
};