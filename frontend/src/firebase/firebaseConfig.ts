import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3NU0SZ4PgKFDNbiar6NGa3PpYioHSaqI",
  authDomain: "build-pilot.firebaseapp.com",
  projectId: "build-pilot",
  storageBucket: "build-pilot.firebasestorage.app",
  messagingSenderId: "5865197158",
  appId: "1:5865197158:web:53c656a2b836ee0672a7a7",
  measurementId: "G-4KEM5BY8BN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();