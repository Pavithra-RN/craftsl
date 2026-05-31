import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.signOut()

  const response = NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 
    'https://craftsl-git-main-pavithra-rns-projects.vercel.app')
  )

  // Clear all supabase cookies
  cookieStore.getAll().forEach(cookie => {
    if (cookie.name.includes('sb-') || 
        cookie.name.includes('supabase')) {
      response.cookies.delete(cookie.name)
    }
  })

  return response
}
