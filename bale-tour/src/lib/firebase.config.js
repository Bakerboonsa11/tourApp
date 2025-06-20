// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getauth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtjLpbCWAu9RSLTKxijzWLSg6n7NSaq0M",
  authDomain: "bale-tour-ee0ea.firebaseapp.com",
  projectId: "bale-tour-ee0ea",
  storageBucket: "bale-tour-ee0ea.firebasestorage.app",
  messagingSenderId: "851368664450",
  appId: "1:851368664450:web:0ec6a39235ca9b1f94839b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth =getauth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);