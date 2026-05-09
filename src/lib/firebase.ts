// src/lib/firebase.ts
// Firebase initialization for Lorapok Labs Developer Mode
// All config values sourced from environment variables (VITE_FIREBASE_*)

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Avoid re-initializing on HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
);
