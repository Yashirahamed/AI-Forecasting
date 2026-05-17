// ─────────────────────────────────────────────────────────────
// Supabase Client — Frontend
//
// SUPABASE CONSOLE SETUP (supabase.com):
//   1. Create new project: "weathercast-ai"
//   2. Region: Southeast Asia (Singapore)
//   3. SQL Editor → run all CREATE TABLE migrations
//   4. Authentication → Disable Supabase Auth (we use Firebase)
//   5. Table Editor → enable RLS on all tables
//   6. Add RLS policy per table:
//      - Allow all for service_role (backend uses this)
//      - For frontend reads: Allow SELECT where user matches
//   7. Realtime → enable for alerts table
//   8. Settings → API → copy URL + anon key → add to .env
// ─────────────────────────────────────────────────────────────

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
