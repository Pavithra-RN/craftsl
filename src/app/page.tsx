'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { 
  Search, 
  Sparkles, 
  Hammer, 
  ChevronRight, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight,
  Palette,
  Soup,
  Gem,
  Scissors,
  Paintbrush
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  title: string;
  price: number;
  craft_type: string;
  images: string[];
  artisans: {
    display_name: string;
  } | null;
}

interface Artisan {
  id: string;
  display_name: string;
  craft_type: string;
  region: string;
  profile_image_url: string | null;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredArtisans, setFeaturedArtisans] = useState<Artisan[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

        const productsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/products?featured=eq.true&is_active=eq.true&select=*,artisans(id,display_name,verified,region,craft_type)`,
          { headers: { 'apikey': ANON_KEY } }
        )
        const fetchedProducts = await productsRes.json()
        if (Array.isArray(fetchedProducts)) setProducts(fetchedProducts as Product[])

        // Fetch featured artisans from Supabase REST API
        const artisanRes = await fetch(
          `${SUPABASE_URL}/rest/v1/artisans?featured=eq.true&verified=eq.true&select=*`,
          { headers: { 'apikey': ANON_KEY } }
        )
        const artisanData = await artisanRes.json()
        if (Array.isArray(artisanData)) setFeaturedArtisans(artisanData as Artisan[])
      } catch (err) {
        console.error("Data load failed in Home Page:", err);
      }
    };

    loadData();
  }, []);

  // Predefined Categories styling
  const categories = [
    { name: 'Batik', value: 'batik', desc: 'Vibrant dyed textiles & fabrics', bg: 'bg-[#8B1A1A]/10 border-[#8B1A1A]/20 text-[#8B1A1A]', icon: Palette },
    { name: 'Pottery', value: 'pottery', desc: 'Earthen clay cookware & pottery', bg: 'bg-[#D4890A]/10 border-[#D4890A]/20 text-[#D4890A]', icon: Soup },
    { name: 'Woodwork', value: 'woodwork', desc: 'Traditional hand-carved masks & items', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: Hammer },
    { name: 'Gems', value: 'gems', desc: 'Polished local gemstones & jewelry', bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: Gem },
    { name: 'Weaving', value: 'weaving', desc: 'Handloom textiles & reed mats', bg: 'bg-indigo-50 border-indigo-200 text-indigo-800', icon: Scissors },
    { name: 'Lacquerwork', value: 'lacquerwork', desc: 'Detailed lacquer painted vessels', bg: 'bg-[#8B1A1A]/5 border-[#8B1A1A]/10 text-[#8B1A1A]', icon: Paintbrush },
  ];

  // Placeholder products if DB empty
  const placeholderProducts = [
    { id: '1', title: 'Maha Kola Sanni Wood Mask', price: 18500, category: 'woodwork', artisan: 'Galle Mask Artisans' },
    { id: '2', title: 'Traditional Silk Batik Sarong', price: 9500, category: 'batik', artisan: 'Matara Handloom Co.' },
    { id: '3', title: 'Earthen Clay Terracotta Pot', price: 3200, category: 'pottery', artisan: 'Kegalle Pottery Village' },
    { id: '4', title: 'Hand-Polished Brass Oil Lamp', price: 14200, category: 'other', artisan: 'Pilimatalawa Brass Guild' },
  ];



  return (
    <div className="flex flex-col w-full bg-[#FAFAFA] text-[#1E1E1E]">
      
      {/* 1. HERO SECTION */}
      <section 
        style={{
          backgroundImage: 'linear-gradient(rgba(139, 26, 26, 0.75), rgba(30, 10, 10, 0.85)), url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        className="relative w-full text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background decorative gold highlights */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#D4890A]/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-white border border-white/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Sri Lankan Artisan Marketplace</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
              Discover Authentic <br className="sm:hidden" />
              <span className="text-[#D4890A]">Sri Lankan</span> Crafts
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Handmade by verified artisans. Shipped worldwide. Purchase authentic traditional masks, batik, clay ceramics, brassware, and handmade jewelry.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#D4890A] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#D4890A]/90 transition-all active:scale-98"
            >
              Shop Now
              <ShoppingBag className="ml-2.5 h-5 w-5" />
            </Link>
            <Link
              href="/artisans"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-all active:scale-98"
            >
              Meet Our Artisans
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto w-full pt-4">
            <form action="/products" method="GET" className="relative w-full flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search products by name, craft, or artisan..."
                className="w-full pl-12 pr-28 py-4 rounded-xl border-none bg-white text-[#1E1E1E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4890A] text-sm shadow-md"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-lg bg-[#8B1A1A] hover:bg-[#8B1A1A]/90 text-white font-semibold text-xs shadow transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. STATS ROW */}
      <section className="relative -mt-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: '140M+ USD', label: 'Sri Lanka craft exports per year', sub: 'Preserving local economies' },
            { value: '3M+', label: 'Sri Lankan diaspora worldwide', sub: 'Connecting heritage back home' },
            { value: '100% Verified', label: 'Every artisan authenticated by our team', sub: 'Guaranteed local authenticity' },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white border-l-4 border-[#8B1A1A] rounded-xl shadow-md p-6 flex flex-col justify-center space-y-1 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#8B1A1A]">{stat.value}</h3>
              <p className="text-sm font-bold text-[#1E1E1E]">{stat.label}</p>
              <p className="text-xs text-[#5A5A5A]">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CRAFT CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1E1E]">Shop by Craft</h2>
          <p className="text-sm text-[#5A5A5A] max-w-xl mx-auto">
            Browse our curated collections defined by traditional Sri Lankan artisan disciplines.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.value}
                href={`/products?craft_type=${cat.value}`}
                className={`flex flex-col justify-between p-5 rounded-2xl border ${cat.bg} hover:shadow-lg hover:scale-102 transition-all duration-300 group text-left`}
              >
                <div className="space-y-2">
                  <span className="inline-flex p-2 rounded-xl bg-white/60 text-current">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h4 className="font-extrabold text-base tracking-tight">{cat.name}</h4>
                  <p className="text-[10px] opacity-80 leading-relaxed hidden sm:block">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ChevronRight className="h-4 w-4 ml-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="bg-white border-y border-gray-100 py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-3xl font-extrabold text-[#1E1E1E]">Featured Products</h2>
              <p className="text-sm text-[#5A5A5A]">
                Discover unique creations freshly added by our verified artisan network.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-bold text-[#8B1A1A] hover:text-[#8B1A1A]/80 transition-colors group"
            >
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((prod) => (
                <div key={prod.id} className="bg-[#FAFAFA] border border-gray-100 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300 flex flex-col">
                  {/* Image area */}
                  <div className="relative aspect-square w-full bg-gray-200 overflow-hidden">
                    {prod.images && prod.images.length > 0 ? (
                      <Image
                        src={prod.images[0]}
                        alt={prod.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-w-7xl) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#8B1A1A]/5 flex flex-col items-center justify-center p-4">
                        <ShoppingBag className="h-8 w-8 text-[#8B1A1A]/30 mb-2" />
                        <span className="text-[10px] font-bold text-[#8B1A1A]/60 uppercase tracking-widest bg-white px-2 py-1 rounded border border-[#8B1A1A]/10">
                          {prod.craft_type}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Text Details */}
                  <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-[#D4890A] uppercase tracking-wider">
                        {prod.craft_type}
                      </p>
                      <h4 className="font-bold text-sm text-[#1E1E1E] line-clamp-1 group-hover:text-[#8B1A1A] transition-colors">
                        {prod.title}
                      </h4>
                      <p className="text-xs text-[#5A5A5A]">
                        By {prod.artisans?.display_name || 'Verified Artisan'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="font-extrabold text-sm text-[#1E1E1E]">
                        LKR {prod.price.toLocaleString()}
                      </span>
                      <button className="p-2 rounded-lg bg-[#8B1A1A] text-white hover:bg-[#8B1A1A]/90 transition-colors shadow-sm active:scale-95">
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Placeholder layout if no products are found in the database
              placeholderProducts.map((prod) => (
                <div key={prod.id} className="bg-[#FAFAFA] border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between opacity-85 group">
                  <div className="relative aspect-square w-full bg-[#8B1A1A]/5 flex flex-col items-center justify-center p-4 text-center">
                    <span className="absolute top-3 right-3 text-[9px] font-extrabold bg-[#D4890A] text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                      Coming soon
                    </span>
                    <ShoppingBag className="h-10 w-10 text-[#8B1A1A]/20 mb-2" />
                    <p className="text-[10px] font-bold text-[#8B1A1A]/40 uppercase tracking-wider">
                      {prod.category}
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-[#1E1E1E] line-clamp-1">{prod.title}</h4>
                      <p className="text-xs text-[#5A5A5A]">By {prod.artisan}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="font-extrabold text-sm text-[#1E1E1E]">
                        LKR {prod.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#8B1A1A] font-bold">Preview</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. MEET THE ARTISANS SECTION */}
      <section className="max-w-7xl mx-auto w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1E1E]">Meet Our Artisans</h2>
          <p className="text-sm text-[#5A5A5A] max-w-xl mx-auto">
            Discover the families and storytellers holding up generations of Sri Lankan heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArtisans.map(artisan => (
            <Link key={artisan.id} href={`/artisans/${artisan.id}`}>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-100 mx-auto mb-4">
                  {artisan.profile_image_url ? (
                    <Image 
                      src={artisan.profile_image_url} 
                      alt={artisan.display_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#8B1A1A]/10">
                      <span className="text-2xl font-bold text-[#8B1A1A]">
                        {artisan.display_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-center text-[#1E1E1E]">
                  {artisan.display_name}
                </h3>
                <p className="text-xs text-center text-gray-500 capitalize mt-1">
                  {artisan.craft_type} · {artisan.region}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="bg-white border-t border-gray-100 py-20 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-[#1E1E1E]">How It Works</h2>
            <p className="text-sm text-[#5A5A5A] max-w-xl mx-auto">
              Connecting you directly to independent artisan workshops across Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Browse', desc: 'Discover unique handmade crafts from verified Sri Lankan artisans.' },
              { step: '2', title: 'Buy', desc: 'Secure checkout with PayPal, Stripe, or local PayHere.' },
              { step: '3', title: 'Ships to you', desc: 'Artisans ship directly to buyers worldwide.' },
              { step: '4', title: 'Impact', desc: '85 percent of every sale goes directly to the artisan.' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-4 group">
                <div className="h-14 w-14 rounded-full bg-[#8B1A1A] text-white font-black text-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                  {step.step}
                </div>
                <h4 className="font-extrabold text-lg text-[#1E1E1E]">{step.title}</h4>
                <p className="text-xs text-[#5A5A5A] max-w-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VERIFIED TRUST BANNER */}
      <section className="w-full bg-[#8B1A1A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-white/10 shrink-0 text-[#D4890A]">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-base">Verified Artisan Guarantee</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Every artisan on CraftSL is manually verified by our team. We check identity, craft quality, and product authenticity before any seller goes live.
              </p>
            </div>
          </div>
          <Link
            href="/about"
            className="shrink-0 bg-[#D4890A] hover:bg-[#D4890A]/90 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition-all active:scale-95 flex items-center"
          >
            <span>Learn more</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
