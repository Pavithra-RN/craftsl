'use client';

import React from 'react';
import { Sparkles, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E] space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Platform Regulations</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Terms of <span className="text-[#8B1A1A]">Service</span>
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Last Updated: May 31, 2026
        </p>
      </div>

      {/* Terms list */}
      <div className="bg-white border border-gray-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-8 text-sm text-[#5A5A5A] leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Scale className="h-5 w-5 shrink-0" />
            1. Acceptance of Terms
          </h2>
          <p>
            By using the CraftSL registry, browsing the product catalog, registering an account, or placing checkout orders, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Scale className="h-5 w-5 shrink-0" />
            2. Use of Service
          </h2>
          <p>
            CraftSL is a peer-to-peer marketplace direct-connecting global buyers with local Sri Lankan workshops. Users must represent genuine, truthful contact info, and maintain appropriate account credentials security.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Scale className="h-5 w-5 shrink-0" />
            3. Payments & Commission Splits
          </h2>
          <p>
            All checkout purchases are securely processed by Stripe or regional gateways. For each order item payment:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>85% of checkout price goes directly to the verified artisan.</li>
            <li>15% goes to CraftSL platform maintenance.</li>
            <li>Shipping charges and custom entry clearance duties are paid separately at checkout.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Scale className="h-5 w-5 shrink-0" />
            4. Prohibited Content
          </h2>
          <p>
            resellers, intermediate agents, or mass-factory suppliers are strictly barred from opening artisan stores. Listings must represent authentic, locally crafted products originating from checked Sri Lankan studios.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Scale className="h-5 w-5 shrink-0" />
            5. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate accounts that breach platform rules, submit false identification, or violate the fair trade and authenticity guidelines of the CraftSL community.
          </p>
        </div>
      </div>
    </div>
  );
}
