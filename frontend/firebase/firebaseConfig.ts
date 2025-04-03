// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCc7rBnNm2LaSTZZRWTGGqU5slCASEeQ4w",
  authDomain: "ai-powered-financial-assistant.firebaseapp.com",
  projectId: "ai-powered-financial-assistant",
  storageBucket: "ai-powered-financial-assistant.firebasestorage.app",
  messagingSenderId: "603356816072",
  appId: "1:603356816072:web:fc8301605584ce08e83bfd",
  measurementId: "G-C8NRCB2PX1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth - Ensure this line doesn't throw errors
export const auth = getAuth(app);

// Providers for Google and GitHub
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();



