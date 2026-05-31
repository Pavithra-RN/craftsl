'use client';

import React from 'react';
import { Sparkles, BarChart, Globe, HelpCircle, HeartHandshake } from 'lucide-react';

export default function ImpactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Making a Real Difference</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Our <span className="text-[#8B1A1A]">Impact</span>
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed">
          Through direct-to-consumer ecommerce and transparent fair trade commissions, we are revitalizing traditional Sri Lankan craft communities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { label: 'Artisans Vetted & Supported', val: '450+ Guilds', icon: HeartHandshake, bg: 'bg-red-50', text: 'text-[#8B1A1A]' },
          { label: 'Platform Orders Placed', val: '12,500+ Items', icon: BarChart, bg: 'bg-amber-50', text: 'text-[#D4890A]' },
          { label: 'Global Destinations Reached', val: '40+ Countries', icon: Globe, bg: 'bg-blue-50', text: 'text-blue-600' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm text-center space-y-4 transition-all hover:shadow-md">
              <div className={`p-4 rounded-full mx-auto w-fit ${stat.bg} ${stat.text}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-[#1E1E1E]">{stat.val}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#8B1A1A] tracking-tight">Preserving Sri Lankan Heritage</h2>
          <p className="text-sm text-[#5A5A5A] leading-relaxed">
            Many traditional Sri Lankan crafts—such as the creation of Dumbara mats, lacquer work containers, and Ambalangoda masks—are at risk of extinction. The younger generation in rural communities often migrates to urban centers for factory labor due to lack of stable local income.
          </p>
          <p className="text-sm text-[#5A5A5A] leading-relaxed">
            By connecting local studios with high-value international customers, CraftSL raises artisan household income by up to 2.5x. This makes craftsmanship a viable, prestigious livelihood, encouraging the continuation of native cultural techniques.
          </p>
        </div>
        <div className="bg-[#FAFAFA] border border-gray-100 p-6 sm:p-8 rounded-2xl space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#D4890A]" />
            Where does your money go?
          </h3>
          <div className="space-y-4 text-xs text-[#5A5A5A]">
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold">Artisan Share (Direct Raw Income)</span>
              <span className="font-black text-[#8B1A1A]">85.0%</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold">Payment Gateway Processing Fees</span>
              <span className="font-bold">3.5%</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-bold">Secure Cloud Hosting & Tech Support</span>
              <span className="font-bold">5.0%</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-bold">Logistics & Direct Delivery Ops</span>
              <span className="font-bold">6.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
