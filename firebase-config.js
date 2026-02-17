// Firebase Configuration
// ⚠️ IMPORTANT: NEVER commit real API keys to GitHub!
//
// Setup for Local Development:
//   1. A firebase-config.local.js file is created with your real credentials
//   2. This file is in .gitignore and will NOT be committed
//   3. The app automatically uses local config if it exists
//
// Setup for Production/GitHub:
//   1. firebase-config.js uses placeholder values
//   2. Set environment variables in your hosting platform
//   3. See deployment guide in README.md

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Default placeholder configuration
const defaultConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Load local config if available (from firebase-config.local.js in .gitignore)
let firebaseConfig = defaultConfig;
try {
  // Try to import local config which contains real credentials
  // This file is in .gitignore and won't be committed to Git
  const localModule = await import('./firebase-config.local.js');
  if (localModule.firebaseConfig) {
    firebaseConfig = localModule.firebaseConfig;
    console.log("✅ Using local Firebase configuration (firebase-config.local.js)");
  }
} catch (error) {
  console.warn("⚠️ firebase-config.local.js not found. Using placeholder configuration.");
  console.warn("📝 For local development, create firebase-config.local.js with your credentials.");
}

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
