// ─────────────────────────────────────────────────────────────
// Firebase Admin SDK — Auth verification ONLY
//
// SETUP:
//   1. console.firebase.google.com → Project Settings → Service Accounts
//   2. Generate new private key → save as serviceAccountKey.json
//   3. Add FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY,
//      FIREBASE_CLIENT_EMAIL to .env
// ─────────────────────────────────────────────────────────────

import admin from 'firebase-admin'

const getAdminApp = () => {
  if (admin.apps.length > 0) return admin.apps[0]!

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  })
}

const adminApp = getAdminApp()
export const adminAuth = admin.auth(adminApp)
