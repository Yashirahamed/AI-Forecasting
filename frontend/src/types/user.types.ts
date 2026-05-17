export interface SupabaseUser {
  id: string
  firebase_uid: string
  name: string | null
  email: string
  avatar_url: string | null
  home_city: string | null
  favourite_cities: string[]
  preferred_unit: 'celsius' | 'fahrenheit'
  language: string
  role: 'user' | 'admin'
  eco_score: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_type: string
  badge_name: string
  badge_icon: string
  earned_at: string
}

export interface EcoScoreEntry {
  id: string
  user_id: string
  city: string | null
  score_delta: number
  reason: string
  created_at: string
}

export interface AuthContextType {
  user: import('firebase/auth').User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
