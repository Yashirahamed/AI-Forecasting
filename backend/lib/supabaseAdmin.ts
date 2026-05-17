// ─────────────────────────────────────────────────────────────
// Supabase Admin Client — uses SERVICE_ROLE_KEY (bypasses RLS)
//
// SETUP:
//   1. supabase.com → Settings → API
//   2. Copy "service_role" secret key → SUPABASE_SERVICE_ROLE_KEY in .env
//   WARNING: Never expose service_role key on the frontend!
// ─────────────────────────────────────────────────────────────

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.')
}

export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
