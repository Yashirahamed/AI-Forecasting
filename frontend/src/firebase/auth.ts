import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();

// Sign in with email and password
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

// Sign up with email and password
export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

// Sign in with Google OAuth
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Sign out from Firebase
export const signOut = () => firebaseSignOut(auth);

// Get current user ID token for backend API authentication
export const getIdToken = async () => {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

// Listen for authentication state changes
export const onAuthChange = (callback: (user: User | null) => void) => 
  onAuthStateChanged(auth, callback);
