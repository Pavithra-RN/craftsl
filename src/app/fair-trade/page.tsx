'use client';

import React from 'react';
import { Sparkles, ShieldCheck, DollarSign, Scale, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FairTradePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Platform Integrity</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Our <span className="text-[#8B1A1A]">Fair Trade</span> Commitment
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed">
          CraftSL operates on a transparent fee schedule designed to return the highest possible percentage of earnings to the artisan workshops.
        </p>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-16">
        {/* Model breakdown */}
        <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              The 85% Artisan Earnings Model
            </h2>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              Whenever a customer purchases a product on CraftSL, **85% of the sales price** goes directly to the verified artisan. CraftSL holds a **15% commission** to support global operations.
            </p>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              This 15% is spent entirely on maintaining digital cloud infrastructure, integrating secure global checkouts, and negotiating high-volume shipping discounts with international shipping carriers so that global shipping rates stay competitive.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs font-bold text-amber-900 leading-relaxed">
            Note: Shipping fees and local custom clearance duties are paid separately at checkout and go directly to logistics partners (DHL/FedEx).
          </div>
        </div>

        {/* Traditional vs CraftSL */}
        <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
              <Scale className="h-6 w-6" />
              CraftSL vs Traditional Channels
            </h2>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              Traditional craft brokers buy products at low prices from rural workshops and sell them at steep markups in high-end city boutiques or international export stores. The artisan receives only a fraction of the value.
            </p>
          </div>
          <div className="space-y-3 text-xs font-semibold text-[#5A5A5A]">
            <div className="flex items-center justify-between border-b pb-2">
              <span>Traditional Export Agent Model</span>
              <span className="font-extrabold text-red-600">20% - 30% to Artisan</span>
            </div>
            <div className="flex items-center justify-between pb-1 text-[#8B1A1A] font-black">
              <span>CraftSL Marketplace Model</span>
              <span className="font-extrabold text-[#8B1A1A]">85% Direct to Artisan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vetting explanation */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        <ShieldCheck className="h-12 w-12 text-[#D4890A]" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#8B1A1A] tracking-tight">Our Vetting & Verification Process</h2>
        <p className="text-sm text-[#5A5A5A] leading-relaxed max-w-2xl mx-auto">
          We don’t allow reseller agents or middle traders. Our verification coordinators visit workshops in regions like Kegalle, Ambalangoda, and Kandy to check that all items are genuinely crafted locally by traditional methods. Look for the Verified Badge across artisan profiles to guarantee the heritage quality of your purchase.
        </p>
        <Link
          href="/artisans"
          className="inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow hover:bg-[#8B1A1A]/95 transition-all space-x-2"
        >
          <span>Meet Vetted Artisans</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
