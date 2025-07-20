// Import the functions you need from the SDKs you need
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEtLolqvx65BfQ2zRw4MqpQKn1IEurFZU",
  authDomain: "researchhub-7e718.firebaseapp.com",
  projectId: "researchhub-7e718",
  storageBucket: "researchhub-7e718.firebasestorage.app",
  messagingSenderId: "65929541562",
  appId: "1:65929541562:web:09deedf9abe11d3fabcf83",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
