import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'craftsl-auth',
    autoRefreshToken: true,
    detectSessionInUrl: false,
  }
})

export function createClient() {
  return supabaseClient
}
