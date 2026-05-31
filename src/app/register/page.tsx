'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, CheckCircle2, User, Hammer, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  // Basic Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'artisan'>('buyer');

  // Artisan Extra Fields
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [craftType, setCraftType] = useState('woodwork');
  const [region, setRegion] = useState('');

  // Status UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    if (role === 'artisan') {
      if (!displayName.trim() || !region.trim() || !bio.trim()) {
        setErrorMsg('Please fill in all artisan fields, including display name, bio, and region.');
        setLoading(false);
        return;
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setErrorMsg('Something went wrong during signup. Please try again.');
        setLoading(false);
        return;
      }

      // Insert/upsert into profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: role,
        });

      if (profileError) {
        console.error("Profiles upsert failed:", profileError);
        setErrorMsg(`Profile configuration failed: ${profileError.message}`);
        setLoading(false);
        return;
      }

      console.log("Profiles upsert succeeded for user ID:", data.user.id);

      // If artisan, also insert into artisans table
      if (role === 'artisan') {
        console.log("Attempting artisan insert", {
          user_id: data.user.id,
          display_name: displayName,
          craft_type: craftType,
          region: region
        });

        const { data: artisanInsertData, error: artisanError } = await supabase
          .from('artisans')
          .insert({
            user_id: data.user.id,
            display_name: displayName,
            bio: bio,
            craft_type: craftType,
            region: region,
            verified: false,
            verification_status: 'pending',
          })
          .select();

        console.log("Artisan insert result:", { data: artisanInsertData, error: artisanError });

        if (artisanError) {
          console.error("Artisan insert failed error object:", artisanError);
          setErrorMsg(`Artisan profile creation failed: ${artisanError.message} (${artisanError.code || 'NO_CODE'})`);
          setLoading(false);
          return;
        }
      }

      // Redirect based on role
      if (role === 'artisan') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }

      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAFAFA] to-white overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-[#D4890A]/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#8B1A1A]/5 blur-3xl" />

      <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-3xl shadow-xl p-8 sm:p-10 z-10 transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join our authentic heritage community</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1E1E1E]">Create your CraftSL Account</h2>
          <p className="text-sm text-[#5A5A5A]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#8B1A1A] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start space-x-3 text-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Success!</p>
              <p className="text-xs mt-1">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Registration Failed</p>
              <p className="text-xs mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Step 1: Role Selector (Clickable Cards) */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-[#1E1E1E] uppercase tracking-wider">Choose your role</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Buyer Card */}
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex items-start p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                  role === 'buyer'
                    ? 'border-[#D4890A] bg-[#D4890A]/5 shadow-md scale-[1.01]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-xl mr-4 ${role === 'buyer' ? 'bg-[#D4890A] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E1E1E] text-base">I am a Buyer</h4>
                  <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">
                    Discover, support, and purchase direct-from-artisan crafts.
                  </p>
                </div>
              </button>

              {/* Artisan Card */}
              <button
                type="button"
                onClick={() => setRole('artisan')}
                className={`flex items-start p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                  role === 'artisan'
                    ? 'border-[#8B1A1A] bg-[#8B1A1A]/5 shadow-md scale-[1.01]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`p-3 rounded-xl mr-4 ${role === 'artisan' ? 'bg-[#8B1A1A] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Hammer className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1E1E1E] text-base">I am an Artisan</h4>
                  <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">
                    Create a profile, list your crafts, and showcase your heritage.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Grid Layout for General Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Pathum Bandara"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pathum@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
              Password (Min 8 Characters)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
            />
          </div>

          {/* Extra Artisan Fields */}
          {role === 'artisan' && (
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-6 animate-fade-in">
              <div className="border-b border-gray-200 pb-3">
                <h3 className="text-sm font-bold text-[#8B1A1A] uppercase tracking-wider">Artisan Profile Details</h3>
                <p className="text-xs text-[#5A5A5A] mt-1">Tell us about your craft to kickstart your verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Display Name */}
                <div className="space-y-1.5">
                  <label htmlFor="displayName" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
                    Artisan Display/Business Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    required={role === 'artisan'}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Bandara Woodcarvers"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
                  />
                </div>

                {/* Craft Type */}
                <div className="space-y-1.5">
                  <label htmlFor="craftType" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
                    Craft Specialization
                  </label>
                  <select
                    id="craftType"
                    name="craftType"
                    value={craftType}
                    onChange={(e) => setCraftType(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
                  >
                    <option value="batik">Batik</option>
                    <option value="pottery">Pottery</option>
                    <option value="woodwork">Woodwork</option>
                    <option value="gems">Gems</option>
                    <option value="weaving">Weaving</option>
                    <option value="lacquerwork">Lacquerwork</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Region */}
              <div className="space-y-1.5">
                <label htmlFor="region" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
                  Region/District in Sri Lanka
                </label>
                <input
                  id="region"
                  type="text"
                  required={role === 'artisan'}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Ambalangoda (Galle District)"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label htmlFor="bio" className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
                  Artisan Biography & Story
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  required={role === 'artisan'}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your workshop, and the heritage values of your crafts..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A] transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-md transition-all duration-200 flex items-center justify-center space-x-2 ${
              role === 'artisan'
                ? 'bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 hover:shadow-lg active:scale-98'
                : 'bg-[#D4890A] hover:bg-[#D4890A]/95 hover:shadow-lg active:scale-98'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            <span>{loading ? 'Creating Account...' : 'Register Now'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
