'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

import { createClient } from '@/utils/supabase/client';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

function LoginContent() {


  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      const userId = data.user?.id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      const role = profileData?.role
      console.log('Login role:', role)

      if (role === 'admin') {
        window.location.href = '/admin'
      } else if (role === 'artisan') {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/'
      }

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setErrorMsg(message)
      setLoading(false)
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAFAFA] to-white overflow-hidden">
      {/* Decorative Background Accent */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-[#D4890A]/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#8B1A1A]/5 blur-3xl" />

      <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-8 sm:p-10 z-10">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome Back to CraftSL</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E1E1E]">Sign In</h2>
          <p className="text-sm text-[#5A5A5A]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-[#8B1A1A] hover:underline">
              Register Here
            </Link>
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Error signing in</p>
              <p className="text-xs mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
                Password
              </label>
              <span className="text-xs text-[#8B1A1A] hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 hover:shadow-lg active:scale-98 font-semibold text-white shadow-md transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8B1A1A]"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
