'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, CheckCircle2, CreditCard, Ship, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Transparent Supply Chain</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          How <span className="text-[#8B1A1A]">CraftSL</span> Works
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed">
          From rural Sri Lankan clay pits and weaving sheds directly to your international doorstep. Here is how we guarantee authenticity, fairness, and safety.
        </p>
      </div>

      {/* Steps Section */}
      <div className="space-y-16 max-w-5xl mx-auto">
        {[
          {
            step: '01',
            title: 'Discover Heritage Creations',
            icon: Compass,
            desc: 'Browse our catalog of traditional wood carvings, pottery, handloom fabrics, gems, and batik items. Each product page lists the materials used, dimensions, and details about the workshop that created it.'
          },
          {
            step: '02',
            title: 'Verified Craft Credentials',
            icon: CheckCircle2,
            desc: 'Every artisan on CraftSL undergoes verification to confirm they use traditional manufacturing methods and work out of local Sri Lankan studios. Look for the Gold Shield badge signifying our verification guarantee.'
          },
          {
            step: '03',
            title: 'Secure Fair Payments',
            icon: CreditCard,
            desc: 'We partner with secure checkout providers like Stripe to protect payments. When you purchase, CraftSL forwards 85% of your product value directly to the artisan and holds a 15% platform upkeep fee. There are no middleman markup margins.'
          },
          {
            step: '04',
            title: 'Direct International Shipping',
            icon: Ship,
            desc: 'Items are packaged by the artisan workshop and shipped directly from Sri Lanka to your global location using DHL or FedEx. Tracking details are emailed immediately, so you can monitor your order every step of the way.'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-100 p-8 sm:p-12 rounded-3xl shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden transition-all hover:shadow-md"
            >
              {/* Step indicator */}
              <div className="absolute top-0 right-0 p-8 text-7xl font-black text-gray-50/70 select-none">
                {item.step}
              </div>
              <div className="p-4 bg-[#8B1A1A]/10 text-[#8B1A1A] rounded-2xl shrink-0 z-10">
                <Icon className="h-8 w-8" />
              </div>
              <div className="space-y-3 z-10 max-w-2xl">
                <h3 className="font-extrabold text-2xl text-[#1E1E1E]">{item.title}</h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Actions */}
      <div className="mt-20 bg-gradient-to-br from-[#8B1A1A] to-[#8B1A1A]/95 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Support Local Sri Lankan Crafts?</h2>
        <p className="text-sm text-white/90 max-w-xl mx-auto leading-relaxed">
          Shop direct, avoid intermediaries, and bring genuine island heritage into your home today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/products"
            className="px-6 py-3.5 bg-white text-[#8B1A1A] hover:bg-[#D4890A] hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/artisan-application"
            className="px-6 py-3.5 border border-white/20 hover:border-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center"
          >
            Artisan Partnership &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
