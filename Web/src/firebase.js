import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "linear-reporter-405511.firebaseapp.com",
  projectId: "linear-reporter-405511",
  storageBucket: "linear-reporter-405511.appspot.com",
  messagingSenderId: "485346865206",
  appId: "1:485346865206:web:1980eb34f6e3a909c96897",
  measurementId: "G-P55X5SHXQN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
