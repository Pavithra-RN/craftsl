import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let instance: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (instance) return instance
  instance = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      storageKey: 'craftsl-auth',
      storage: {
        getItem: (key) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
        setItem: (key, value) => typeof window !== 'undefined' ? localStorage.setItem(key, value) : undefined,
        removeItem: (key) => typeof window !== 'undefined' ? localStorage.removeItem(key) : undefined,
      },
      autoRefreshToken: true,
      detectSessionInUrl: false,
    }
  })
  return instance
}
