# Firebase Google Authentication Setup Guide

## Complete Step-by-Step Authentication Implementation

### Overview

This guide covers the Google Sign-in implementation used in the Angpao Tracker. The authentication flow is handled by Firebase and all code is in `firebase-config.js` and `app.js`.

---

## Authentication Flow Diagram

```
User clicks "Sign In"
    ↓
signInWithPopup() triggered
    ↓
Google OAuth dialog opens
    ↓
User authenticates with Google
    ↓
Firebase receives auth token
    ↓
currentUser is set with user data
    ↓
initializeUserData() creates user document in Firestore
    ↓
UI updates to show welcome message
    ↓
App loads user's data from Firestore
```

---

## Implementation Details

### 1. Firebase Initialization (`firebase-config.js`)

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Configuration from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Get references to services
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Key Points:**
- `initializeApp()` connects to your Firebase project
- `getAuth()` provides authentication services
- `getFirestore()` provides database services
- These are exported for use in `app.js`

---

### 2. Sign-In Function (`app.js`)

```javascript
export async function signInWithGoogle() {
  try {
    // Step 1: Create Google Auth Provider
    const provider = new GoogleAuthProvider();
    
    // Step 2: Open Google login popup
    const result = await signInWithPopup(auth, provider);
    
    // Step 3: Get user object
    currentUser = result.user;
    console.log("User signed in:", currentUser.email);
    
    // Step 4: Initialize user data in Firestore
    await initializeUserData(
      currentUser.uid, 
      currentUser.email, 
      currentUser.displayName
    );
    
    // Step 5: Update UI
    updateAuthUI();
    
    // Step 6: Load user's data
    loadYears();
    
  } catch (error) {
    console.error("Sign-in error:", error);
    alert("Sign-in failed: " + error.message);
  }
}
```

**User Object Properties:**
```javascript
currentUser = {
  uid: "unique_user_id_from_google",           // Used as Firestore UID
  email: "user@gmail.com",                      // User's email
  displayName: "User's Name",                   // User's name
  photoURL: "https://lh3.googleusercontent.com/...",  // Profile photo
  emailVerified: true,                          // Email verification status
  isAnonymous: false,                           // Not anonymous
  metadata: {
    creationTime: "...",                        // Account creation time
    lastSignInTime: "..."                       // Last sign-in time
  }
}
```

---

### 3. User Data Initialization

```javascript
async function initializeUserData(uid, email, displayName) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // First time login - create user document
      await updateDoc(userRef, {
        email: email,
        name: displayName || "User",
        createdAt: Timestamp.now(),
        lastUpdated: Timestamp.now()
      });
    } else {
      // Returning user - update lastUpdated
      await updateDoc(userRef, {
        lastUpdated: Timestamp.now()
      });
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
}
```

**What This Does:**
- Creates a user document in Firestore under `/users/{uid}`
- Stores user metadata (email, name, timestamps)
- Updates last login time for returning users
- This document becomes the root for all user data

**Firestore Document Created:**
```
users/{uid}/
├── email: "user@gmail.com"
├── name: "User's Name"
├── createdAt: Timestamp (first login)
└── lastUpdated: Timestamp (latest login)
```

---

### 4. Real-Time Auth State Listening

```javascript
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    updateAuthUI();
    loadYears();
  } else {
    currentUser = null;
    updateAuthUI();
  }
});
```

**What This Does:**
- Automatically detects when user logs in
- Automatically detects when user logs out
- Persists login across browser sessions
- Called on every page refresh

---

### 5. Sign-Out Function

```javascript
export async function signOutUser() {
  try {
    await signOut(auth);
    currentUser = null;
    currentYear = null;
    currentDay = null;
    currentVisit = null;
    updateAuthUI();
    clearAllViews();
  } catch (error) {
    console.error("Sign-out error:", error);
  }
}
```

**What This Does:**
- Signs out from Firebase
- Clears all user state
- Hides UI
- Resets to login screen

---

## Security Considerations

### ✅ What's Protected

1. **User UID-Based Data Isolation**
   - All user data stored under `/users/{uid}`
   - Firestore rules only allow access when `auth.uid == {uid}`
   - Users cannot access other users' data

2. **Secure Communication**
   - Uses HTTPS (Firebase Hosting provides this)
   - OAuth tokens never exposed in code
   - Firebase handles token refresh automatically

3. **API Key Protection**
   - API key is only used for Firebase (not a secret)
   - Firebase rules enforce all security
   - Safe to use in frontend code

### ⚠️ What Requires Extra Protection

1. **Sensitive User Data**
   - Don't store passwords (Firebase doesn't either)
   - Don't store credit cards (use external payment service)
   - Use Firestore encryption for sensitive fields

2. **API Keys & Credentials**
   - Never commit to version control
   - Use environment variables in production
   - Regenerate if accidentally exposed

### 🔒 Firestore Security Rules

```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
  
  match /{document=**} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

**This ensures:**
- Only authenticated users can access data
- Users can only access their own `/users/{uid}/*` paths
- All subcollections inherit these permissions
- All other paths are denied by default

---

## Common Authentication Scenarios

### Scenario 1: First-Time User
```
1. User clicks "Sign In with Google"
2. Redirected to Google auth page
3. User authenticates with Google
4. User grants permission to Angpao Tracker
5. Firebase creates new user record
6. initializeUserData() called
7. New /users/{uid} document created in Firestore
8. App loads (no years/data yet - empty state)
```

### Scenario 2: Returning User
```
1. User clicks "Sign In with Google"
2. Google recognizes user (cookie from first login)
3. Automatically authenticates without showing login page
4. Firebase returns existing user record
5. initializeUserData() updates lastUpdated timestamp
6. App loads user's existing data
7. Years, days, and entries appear immediately
```

### Scenario 3: Page Refresh
```
1. User is already logged in
2. Page refreshes
3. onAuthStateChanged() fires
4. Firebase checks for existing auth token
5. If valid, user remains logged in
6. If expired, user is logged out
7. App state restored automatically
```

### Scenario 4: Browser Back Button
```
1. User signs out
2. Clicks browser back button
3. Page appears to show user content
4. onAuthStateChanged() checks auth state
5. Firebase confirms no valid token
6. UI updates to login screen
7. Data is not accessible
```

---

## User Authentication Data Flow

### Data Storage Hierarchy
```
Authentication Layer (Firebase Auth Service)
    ↓
    Contains: uid, email, displayName, photoURL, etc.
    ↓
Application Layer (Firestore Database)
    ↓
    /users/{uid}/metadata
    /users/{uid}/years/{yearId}/days/...
    /users/{uid}/years/{yearId}/days/{dayId}/...
    ... (all subcollections)
```

### Information Flow on Login
```
Google Account
    ↓
Request: signInWithPopup(auth, googleProvider)
    ↓
Google OAuth Dialog
    ↓
User approves "Angpao Tracker" access
    ↓
Google returns ID Token + Access Token
    ↓
Firebase verifies tokens with Google
    ↓
Firebase creates/validates user record
    ↓
Firebase returns currentUser object
    ↓
{
  uid: "abc123...",
  email: "user@gmail.com",
  displayName: "John Doe",
  photoURL: "https://..."
}
    ↓
App stores in global currentUser variable
    ↓
initializeUserData() creates Firestore document
    ↓
/users/abc123.../metadata created
    ↓
Firestore rules check: request.auth.uid == "abc123..."
    ↓
✅ Access granted - document created
    ↓
UI updates and app loads user data
```

---

## Handling Authentication Errors

### Common Errors in console.log()

```javascript
// User cancelled login
"Error: popup_closed_by_user"

// Invalid credentials
"Error: invalid_grant"

// Network error
"Error: A network error (such as timeout, FXN_SKIPPED, etc.) has occurred."

// Firebase not initialized correctly
"Error: Firebase App named '[DEFAULT]' already exists"

// Security rules blocked write
"FirebaseError: Missing or insufficient permissions"
```

---

## Privacy & Permissions

### What Google Auth Shares with Your App

With the current setup, your app can access:
- ✅ User's Google account email
- ✅ User's display name
- ✅ User's profile picture URL
- ✅ User's unique ID (UID)
- ✅ Account creation/login times

### What Your App Cannot Access

- ❌ User's Google password
- ❌ User's other Google services (Gmail, Drive, etc.)
- ❌ User's personal information (phone, address)
- ❌ User's payment methods

### User's Permissions

Users can revoke access anytime:
1. Go to [https://myaccount.google.com/permissions](https://myaccount.google.com/permissions)
2. Find "Angpao Tracker"
3. Click "Remove Access"
4. User is disconnected from the app

---

## Testing Authentication Locally

### Using Firebase Emulator (Advanced)

```javascript
// In firebase-config.js, uncomment:
connectAuthEmulator(auth, "http://localhost:9099");

// Then in terminal:
firebase emulators:start
```

This allows testing without real Google accounts.

### Quick Testing Checklist

- [ ] First login works
- [ ] User data appears
- [ ] Second login remembers data
- [ ] Sign out works
- [ ] Page refresh keeps user logged in
- [ ] Sign out + refresh logs out
- [ ] Different Google account = different data
- [ ] Console shows no auth errors

---

## Production Deployment

### Before Going Live

1. **Update API Key Rules**
   - Firebase Console → Project Settings
   - Restrict API key to Web apps only
   - Add your domain to authorized origins

2. **Set Up Custom Domain**
   - Firebase Hosting → Connect domain
   - Use your custom domain instead of Firebase URL

3. **Enable HTTPS**
   - Firebase Hosting provides free SSL
   - Custom domains auto-enabled

4. **Review Security Rules**
   - Ensure rules from SECURITY_RULES.md are deployed
   - Test with multiple users
   - Monitor Firestore quotas

5. **Set Up Authentication Providers**
   - Firebase Console → Authentication
   - Configure authorized domains
   - Add your production domain

---

## Summary

**Authentication Flow in Angpao Tracker:**

1. ✅ User clicks "Sign In with Google"
2. ✅ Google OAuth popup appears
3. ✅ User authenticates (or is recognized)
4. ✅ Firebase verifies tokens with Google
5. ✅ User document created in Firestore
6. ✅ App loads user's Angpao data
7. ✅ Data remains private and secure
8. ✅ Only this user can access this data

**Result:** Secure, user-specific data management with Lunar New Year tracking! 🧧

---

## Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Google OAuth Documentation](https://developers.google.com/identity/gsi/web)
- [Firebase Console](https://console.firebase.google.com/)

---

Last Updated: February 2026
