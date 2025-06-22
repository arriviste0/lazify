// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdqWRJUpb9fgljv_fK91FZ0CDdWBEUq2o",
  authDomain: "lazify-agency.firebaseapp.com",
  projectId: "lazify-agency",
  storageBucket: "lazify-agency.firebasestorage.app",
  messagingSenderId: "825110361008",
  appId: "1:825110361008:web:7f3d863b1b068fbfecdc75",
  measurementId: "G-5B8L1JNFWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);