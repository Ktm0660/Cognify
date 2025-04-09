import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDrmdc3z5U0SvRvIIcixyyQ_VypVqI1hj0",
  authDomain: "gtw-v3.firebaseapp.com",
  projectId: "gtw-v3",
  storageBucket: "gtw-v3.firebasestorage.app",
  messagingSenderId: "825320721428",
  appId: "1:825320721428:web:61505c5f8ef6b48a0feb01",
  measurementId: "G-KNGFD50RKG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 export db
