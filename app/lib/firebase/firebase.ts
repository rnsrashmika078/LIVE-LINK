// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDF6u0j3cOM-rYysLKap1TzyFwPm89vYz0",
  authDomain: "unimate-social.firebaseapp.com",
  projectId: "unimate-social",
  storageBucket: "unimate-social.firebasestorage.app",
  messagingSenderId: "648767628829",
  appId: "1:648767628829:web:27120247268774c96708f4",
  measurementId: "G-RHBG5SP6PT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
