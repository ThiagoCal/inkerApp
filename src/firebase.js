// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTri69cJZL772wkofDHFbLy4OMvA9cKs8",
  authDomain: "inkerapp-8ecd3.firebaseapp.com",
  projectId: "inkerapp-8ecd3",
  storageBucket: "inkerapp-8ecd3.appspot.com",
  messagingSenderId: "855912595218",
  appId: "1:855912595218:web:4e7f708a455e5d71a33dcb",
  measurementId: "G-85PGXXHGZS",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// console.log('auth',auth);
export const db = getFirestore(app);
// console.log(db);
export const functions = getFunctions(app);

// const analytics = getAnalytics(app);
