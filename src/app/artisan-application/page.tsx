'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, FileText, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

export default function ArtisanApplicationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Grow Your Craft Workshop</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Apply to Become a <span className="text-[#8B1A1A]">CraftSL Artisan</span>
        </h1>
        <p className="text-base text-[#5A5A5A] leading-relaxed">
          Open a digital shop, showcase your traditional products, and start receiving secure orders from global buyers with direct payouts.
        </p>
      </div>

      {/* Benefits and Vetting Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-[#8B1A1A]">Why Partner With Us?</h2>
          <div className="space-y-4">
            {[
              { title: '85% Direct Earnings Model', desc: 'CraftSL takes only a 15% service fee. You receive 85% of your listed product price deposited directly to your bank account.' },
              { title: 'Global Customer Access', desc: 'No marketing costs. We promote your workshop to millions of Sri Lankan diaspora and heritage collectors globally.' },
              { title: 'Simplified Logistics', desc: 'Pack the order, attach our pre-paid shipping label, and DHL or FedEx will collect the package directly from your workshop.' }
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#D4890A]/10 text-[#D4890A] rounded-xl shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-[#1E1E1E]">{benefit.title}</h3>
                  <p className="text-xs text-[#5A5A5A] leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Checklists */}
        <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-[#8B1A1A]">Vetting Requirements</h2>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">
            To guarantee platform authenticity and trust, each applying artisan undergoes check validation by our outreach coordinators. You must supply:
          </p>
          <div className="space-y-4">
            {[
              { req: 'NIC / National Identity Card', desc: 'We verify your identity and legal residency in Sri Lanka.' },
              { req: 'Active Craft Workshop Location', desc: 'A physical studio address where you create your items.' },
              { req: 'Digital Product Photographs', desc: 'High-quality photos of your finished craft products.' },
              { req: 'Craft Demonstration Video', desc: 'A short video clip showing you creating the work.' }
            ].map((req, idx) => (
              <div key={idx} className="flex gap-3 items-start text-xs font-semibold text-[#5A5A5A]">
                <FileText className="h-4 w-4 text-[#8B1A1A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#1E1E1E] font-bold">{req.req}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-sm flex flex-col items-center">
        <div className="p-4 bg-[#8B1A1A]/5 rounded-full text-[#8B1A1A]">
          <UserCheck className="h-10 w-10 opacity-70" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[#1E1E1E]">Ready to Begin Vetting?</h2>
          <p className="text-xs text-[#5A5A5A] max-w-md leading-relaxed mx-auto">
            Create an account, select &quot;Artisan Profile&quot; as your registration type, and complete your verification forms to request profile approval.
          </p>
        </div>
        <Link
          href="/register?role=artisan"
          className="inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow hover:bg-[#8B1A1A]/95 transition-all space-x-2"
        >
          <span>Register as an Artisan</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
