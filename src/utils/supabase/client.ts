import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

let instance: SupabaseClient | null = null

export function createClient() {
  if (instance) return instance
  instance = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
