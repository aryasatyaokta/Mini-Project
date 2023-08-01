// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz_5wPnpq1Vff__5i1RMpVUl4iGSy5Z6k",
  authDomain: "mini-6406b.firebaseapp.com",
  projectId: "mini-6406b",
  storageBucket: "mini-6406b.appspot.com",
  messagingSenderId: "556011332252",
  appId: "1:556011332252:web:a1a725b5a83280cc714359"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);