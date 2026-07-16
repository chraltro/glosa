/**
 * Firebase Configuration
 *
 * SETUP REQUIRED:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Enable Google Authentication: Authentication > Sign-in method > Google > Enable
 * 4. Enable Firestore Database: Firestore Database > Create database > Start in production mode
 * 5. Set Firestore rules to:
 *    rules_version = '2';
 *    service cloud.firestore {
 *      match /databases/{database}/documents {
 *        match /users/{userId} {
 *          allow read, write: if request.auth != null && request.auth.uid == userId;
 *        }
 *      }
 *    }
 * 6. Get your config from Project Settings > General > Your apps > SDK setup and configuration
 *
 * The values below are the real config for this deployment. Firebase web API keys are
 * public identifiers, not secrets: they ship in every client bundle by design. Access is
 * controlled by the Firestore rules above plus the authorized domains list, so keep those
 * tight rather than trying to hide this key.
 */

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyClwLix-PHVCV9soMjiOzvIhZTYyLrPqYU",
  authDomain: "norron-5cf3c.firebaseapp.com",
  projectId: "norron-5cf3c",
  storageBucket: "norron-5cf3c.firebasestorage.app",
  messagingSenderId: "553127903115",
  appId: "1:553127903115:web:c9f895fec921ed2594f98e"
};
