// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { Platform } from "react-native";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvrjOHX6OdIFiT_cKDa7Shsd695xVLPQA",
  authDomain: "unify-28c3e.firebaseapp.com",
  projectId: "unify-28c3e",
  storageBucket: "unify-28c3e.firebasestorage.app",
  messagingSenderId: "996381423741",
  appId: "1:996381423741:web:887bb97414eb05e11a1914",
  measurementId: "G-JMKXDB90FG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only for web platform
export const analytics = Platform.OS === 'web' ? 
  (() => {
    try {
      const { getAnalytics } = require("firebase/analytics");
      return getAnalytics(app);
    } catch (error) {
      console.log('Analytics not available:', error);
      return null;
    }
  })() : null;

export default app;
