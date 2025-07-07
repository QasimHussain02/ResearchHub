// Import the functions you need from the SDKs you need
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-5mMLfWsOOsCpT1jDGKSwx75GJGV2zv8",
  authDomain: "research-hub-533e1.firebaseapp.com",
  projectId: "research-hub-533e1",
  storageBucket: "research-hub-533e1.firebasestorage.app",
  messagingSenderId: "1071881221007",
  appId: "1:1071881221007:web:bfd3b6712dd6ee0a18d1fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
