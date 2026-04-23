import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * NEW: Function to save a game specifically for the logged-in user
 */
export const saveGameForUser = async (gameData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to save games.");

  return await addDoc(collection(db, "savedGames"), {
    ...gameData,
    userId: user.uid, // This links the game to the specific user
    savedAt: new Date()
  });
};

/**
 * NEW: Function to fetch only the games belonging to the logged-in user
 */
export const getMyGames = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "savedGames"), 
    where("userId", "==", user.uid) // Filters out everyone else's data
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};