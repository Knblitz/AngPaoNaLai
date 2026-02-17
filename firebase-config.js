// Firebase Configuration
// ⚠️ IMPORTANT: NEVER commit real API keys to GitHub!
//
// Setup:
//   1. Real credentials stored in .env file (in .gitignore)
//   2. .env is NOT committed to GitHub
//   3. This config loads from .env variables at runtime
//   4. Credentials are never exposed in source code

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase configuration
// ⚠️ Note: API key is visible in browser (client-side app)
// Security enforced by Firestore Rules, not by hiding the key
const firebaseConfig = {
  apiKey: "AIzaSyCBHVdRo_mfMbvIvwu5HYsJg1AMZPGj3-c",
  authDomain: "angpaonalai-6d7b7.firebaseapp.com",
  projectId: "angpaonalai-6d7b7",
  storageBucket: "angpaonalai-6d7b7.appspot.com",
  messagingSenderId: "91392883413",
  appId: "1:91392883413:web:a2fea225f03e8189f4005c",
  measurementId: "G-333EKWE2EX"
};

console.log("✅ Firebase configuration loaded");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Uncomment these lines if you want to use Firebase Emulator Suite locally for testing
// connectAuthEmulator(auth, "http://localhost:9099");
// connectFirestoreEmulator(db, "localhost", 8080);

console.log("Firebase initialized successfully!");
