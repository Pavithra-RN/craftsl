'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, Sparkles, User, Loader2 } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const res = await fetch(
          'https://mmcxkgjbuscrrpuxxczs.supabase.co/rest/v1/artisans?verified=eq.true&select=*',
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'
            }
          }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch artisans.');
        }

        const data = await res.ok ? await res.json() : [];
        if (Array.isArray(data)) {
          setArtisans(data);
        }
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Heritage Custodians</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Meet Our <span className="text-[#8B1A1A]">Artisans</span>
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed">
          Discover the master craftsmen and women keeping Sri Lankan heritage crafts alive. Purchased items go directly toward supporting their livelihoods.
        </p>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="h-10 w-10 text-[#8B1A1A] animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Discovering artisan workshops...</p>
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-red-50 border border-red-100 text-center space-y-2 text-red-800 shadow-sm">
          <p className="font-extrabold text-base">Error Loading Artisans</p>
          <p className="text-xs opacity-90">{error}</p>
        </div>
      ) : artisans.length === 0 ? (
        <div className="max-w-md mx-auto p-12 bg-white border border-gray-100 rounded-3xl text-center space-y-4 shadow-sm">
          <p className="text-lg font-bold text-gray-400">No Verified Artisans</p>
          <p className="text-xs text-gray-500">Check back later as we register and verify more local workshops.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <Link
              key={artisan.id}
              href={`/artisans/${artisan.id}`}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group"
            >
              {/* Profile Image & Avatar */}
              <div className="relative h-48 w-full bg-gradient-to-br from-[#8B1A1A]/10 to-[#D4890A]/10 flex items-center justify-center overflow-hidden">
                {artisan.profile_image_url ? (
                  <Image
                    src={artisan.profile_image_url}
                    alt={artisan.display_name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                    sizes="(max-w-7xl) 50vw, (max-w-1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="bg-[#8B1A1A]/10 p-6 rounded-full text-[#8B1A1A]/40">
                    <User className="h-12 w-12" />
                  </div>
                )}
                {/* Craft type badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase text-[#8B1A1A] tracking-wider shadow-sm">
                    {artisan.craft_type}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-xl text-[#1E1E1E] group-hover:text-[#8B1A1A] transition-colors truncate">
                      {artisan.display_name}
                    </h3>
                    {artisan.verified && (
                      <span title="Verified Artisan Check">
                        <ShieldCheck className="h-5 w-5 text-[#D4890A] fill-[#D4890A]/10 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5A5A5A] line-clamp-2 leading-relaxed">
                    {artisan.bio || 'Preserving the heritage of traditional crafts and quality guarantee.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-500 font-medium">
                    <MapPin className="h-4 w-4 text-[#D4890A] mr-1 shrink-0" />
                    <span>{artisan.region}</span>
                  </div>
                  <span className="font-bold text-[#8B1A1A] group-hover:text-[#D4890A] transition-colors flex items-center gap-0.5">
                    View Studio &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
