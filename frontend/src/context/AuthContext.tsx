import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { User } from 'firebase/auth'
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
} from '@/firebase/auth'
import { supabase } from '@/supabase/supabaseClient'
import { AuthContextType, SupabaseUser } from '@/types/user.types'

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/**
 * Upsert user into Supabase users table after Firebase auth
 */
const upsertSupabaseUser = async (
  firebaseUser: User,
  name?: string,
): Promise<SupabaseUser | null> => {
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: name ?? firebaseUser.displayName ?? null,
        avatar_url: firebaseUser.photoURL ?? null,
      },
      { onConflict: 'firebase_uid' },
    )
    .select()
    .single()

  if (error) {
    console.error('[AuthContext] Supabase upsert error:', error.message)
    return null
  }
  return data as SupabaseUser
}

/**
 * Fetch the Supabase user profile by Firebase UID
 */
const fetchSupabaseUser = async (uid: string): Promise<SupabaseUser | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('firebase_uid', uid)
    .single()

  if (error) return null
  return data as SupabaseUser
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // ─── Listen to Firebase Auth state ──────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const sbUser = await fetchSupabaseUser(firebaseUser.uid)
        setSupabaseUser(sbUser)
      } else {
        setSupabaseUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmail(email, password)
    const sbUser = await fetchSupabaseUser(result.user.uid)
    setSupabaseUser(sbUser)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithGoogle()
    const sbUser = await upsertSupabaseUser(result.user)
    setSupabaseUser(sbUser)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await signUpWithEmail(email, password)
    const sbUser = await upsertSupabaseUser(result.user, name)
    setSupabaseUser(sbUser)
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
    setSupabaseUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, supabaseUser, loading, login, loginWithGoogle, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
