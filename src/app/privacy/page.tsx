'use client';

import React from 'react';
import { Sparkles, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E] space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 rounded-full bg-[#8B1A1A]/10 px-4 py-1.5 text-xs font-semibold text-[#8B1A1A] border border-[#8B1A1A]/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Security Guarantee</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1E1E1E] sm:text-5xl">
          Privacy <span className="text-[#8B1A1A]">Policy</span>
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Last Updated: May 31, 2026
        </p>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-100 p-8 sm:p-12 rounded-3xl shadow-sm space-y-8 text-sm text-[#5A5A5A] leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Shield className="h-5 w-5 shrink-0" />
            1. Data Collected
          </h2>
          <p>
            When registering on CraftSL, we collect email addresses, contact details, shipping addresses, and payment tokens. For artisans, we collect workshop physical locations, craft descriptions, photos, and National Identity Card (NIC) details for vetting.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Shield className="h-5 w-5 shrink-0" />
            2. How We Use It
          </h2>
          <p>
            We use your data to configure secure user accounts, fulfill checkout transactions, calculate platform revenue, clear customs shipping documentation, and audit artisan applications during verification checks.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Shield className="h-5 w-5 shrink-0" />
            3. Cookies Consent
          </h2>
          <p>
            We use browser localStorage and cookies to maintain active login sessions (`craftsl-auth`), handle shopping carts, and keep administrative tab settings responsive.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Shield className="h-5 w-5 shrink-0" />
            4. Third Parties & Processors
          </h2>
          <p>
            We share relevant delivery coordinates with international logistics channels (DHL/FedEx) and forward payment credentials to secure payment gateways (Stripe). We never sell your personal information.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#8B1A1A] flex items-center gap-2">
            <Shield className="h-5 w-5 shrink-0" />
            5. Contact Us
          </h2>
          <p>
            For questions about account erasure or request audits under privacy rules, please email support@craftsl.com.
          </p>
        </div>
      </div>
    </div>
  );
}
