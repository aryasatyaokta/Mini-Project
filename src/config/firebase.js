// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh2pK4FWm1yqsyYSaF_fwSdt6lgFRCfFs",
  authDomain: "miniproject-e9c5f.firebaseapp.com",
  projectId: "miniproject-e9c5f",
  storageBucket: "miniproject-e9c5f.appspot.com",
  messagingSenderId: "160344795689",
  appId: "1:160344795689:web:ee727492ecbcd355944a38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);