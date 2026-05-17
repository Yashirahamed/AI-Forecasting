import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth'
import { auth } from './firebaseConfig'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

/**
 * Sign in with email and password
 */
export const signInWithEmail = (
  email: string,
  password: string,
): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password)

/**
 * Register a new user with email and password
 */
export const signUpWithEmail = (
  email: string,
  password: string,
): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password)

/**
 * Sign in with Google OAuth popup
 */
export const signInWithGoogle = (): Promise<UserCredential> =>
  signInWithPopup(auth, googleProvider)

/**
 * Sign the current user out
 */
export const signOut = (): Promise<void> => firebaseSignOut(auth)

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChanged = (
  callback: (user: User | null) => void,
): (() => void) => firebaseOnAuthStateChanged(auth, callback)

/**
 * Get the current user's Firebase ID token for backend requests
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}

export { auth }
