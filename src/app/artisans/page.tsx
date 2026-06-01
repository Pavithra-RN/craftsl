'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface Artisan {
  id: string;
  display_name: string;
  bio: string;
  craft_type: string;
  region: string;
  verified: boolean;
  profile_image_url: string | null;
}

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co';
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI';

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/artisans?verified=eq.true&select=*&order=created_at.asc`,
          { headers: { 'apikey': ANON_KEY } }
        );
        const data = await res.json();
        if (Array.isArray(data)) setArtisans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FCFBF9] min-h-screen text-[#1E1E1E]">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-black text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5 text-[#D4890A]" />
          <span className="uppercase tracking-wider">Heritage Custodians</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[#1E1E1E] sm:text-5xl">
          Meet Our <span className="text-[#8B1A1A]">Artisans</span>
        </h1>
        <p className="text-sm font-medium text-gray-500 leading-relaxed">
          Discover the master craftsmen and women keeping traditional Sri Lankan heritage crafts alive. Every purchase goes directly to supporting their local livelihoods.
        </p>
      </div>

      {/* Main Content */}
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[400px]"
            >
              <div className="bg-gray-200 h-56 w-full" />
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : artisans.length === 0 ? (
        // Empty State
        <div className="max-w-md mx-auto p-12 bg-white border border-gray-100 rounded-3xl text-center space-y-4 shadow-sm">
          <div className="bg-[#8B1A1A]/10 p-4 rounded-full w-fit mx-auto text-[#8B1A1A]">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">No artisans found</h2>
          <p className="text-xs text-gray-500">
            Check back later as we register and verify more local workshops.
          </p>
        </div>
      ) : (
        // Artisans Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => {
            const truncatedBio = artisan.bio
              ? artisan.bio.length > 100
                ? `${artisan.bio.substring(0, 100)}...`
                : artisan.bio
              : 'Preserving the heritage of traditional Sri Lankan crafts and quality guarantee.';

            return (
              <Link
                key={artisan.id}
                href={`/artisans/${artisan.id}`}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Profile Image banner */}
                <div className="relative h-56 w-full bg-gradient-to-br from-[#8B1A1A]/5 to-[#D4890A]/5 flex items-center justify-center overflow-hidden border-b border-gray-50">
                  {artisan.profile_image_url ? (
                    <Image
                      src={artisan.profile_image_url}
                      alt={artisan.display_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="bg-[#8B1A1A]/10 p-6 rounded-full text-[#8B1A1A]/40 group-hover:scale-110 transition-transform duration-500">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Heading / Verified badge */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-xl text-[#1E1E1E] group-hover:text-[#8B1A1A] transition-colors truncate">
                          {artisan.display_name}
                        </h3>
                        {artisan.verified && (
                          <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shrink-0">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      {/* Craft Type Subtitle */}
                      <p className="text-xs font-bold text-[#D4890A] capitalize">
                        {artisan.craft_type}
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {truncatedBio}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-500 font-semibold">
                      <MapPin className="h-4 w-4 text-[#8B1A1A] mr-1 shrink-0" />
                      <span>{artisan.region}</span>
                    </div>
                    <span className="font-black text-[#8B1A1A] group-hover:text-[#D4890A] transition-colors flex items-center gap-1 uppercase tracking-wider text-[10px]">
                      View Studio <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
