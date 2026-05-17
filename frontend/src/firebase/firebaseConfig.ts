// ─────────────────────────────────────────────────────────────
// Firebase Configuration — Auth ONLY (no Firestore)
//
// FIREBASE CONSOLE SETUP (console.firebase.google.com):
//   1. Create project: "weathercast-ai"
//   2. Enable Authentication:
//      - Email/Password provider → ON
//      - Google provider → ON (configure OAuth consent screen)
//   3. Project Settings → General → Your apps → Add web app
//      → copy the firebaseConfig object values to .env
//   4. Project Settings → Service Accounts → Generate private key
//      → save as serviceAccountKey.json (NEVER commit to git)
// ─────────────────────────────────────────────────────────────

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

// Prevent duplicate initialization (React StrictMode / HMR)
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

const auth: Auth = getAuth(app)

export { app, auth }
