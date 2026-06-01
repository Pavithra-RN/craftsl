'use client';

import React from 'react';
import { Sparkles, Shield, Heart, HelpCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Hero Section */}
      <section className="bg-[#8B1A1A] text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 bg-[radial-gradient(#D4890A_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#D4890A] border border-[#D4890A]/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Connecting Sri Lankan Craftsmanship</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            About <span className="text-[#D4890A]">CraftSL</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
            Preserving centuries of artistic legacy by connecting home-grown Sri Lankan artisans directly with collectors and global diaspora markets.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-[#8B1A1A] tracking-tight">
              Our Marketplace Mission
            </h2>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              For generations, Sri Lankan craftspeople—weaving delicate Dumbara mats, hand-crafting intricate lacquer work, carving wooden masks, and firing pottery—have struggled to make a sustainable income. Middlemen and traditional export channels pocket the majority of the profits, leaving local communities underserved.
            </p>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">
              <strong>CraftSL</strong> was created to disrupt this cycle. By providing an open digital registry, direct checkout integrations, and global shipping partnerships, we enable local artisans to receive the true value of their skill.
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-extrabold text-xl text-[#1E1E1E]">What We Champion</h3>
            <ul className="space-y-4 text-xs font-medium text-[#5A5A5A]">
              <li className="flex items-start space-x-3">
                <span className="h-2 w-2 rounded-full bg-[#D4890A] shrink-0 mt-1.5" />
                <span>Removing intermediate broker fees so artisans receive 85% of each sale.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="h-2 w-2 rounded-full bg-[#D4890A] shrink-0 mt-1.5" />
                <span>Protecting regional identity, Sri Lankan legacy, and cultural heritage crafts.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="h-2 w-2 rounded-full bg-[#D4890A] shrink-0 mt-1.5" />
                <span>Fostering micro-economies and sustainable workspaces in rural villages.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values Cards */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#8B1A1A]">
              Our Core Pillars
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              The values guiding each listing and transaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '100% Authentic', icon: Shield, desc: 'Every craft is handmade in Sri Lanka using native techniques passed down through generations. No mass manufacturing.' },
              { title: 'Strictly Fair', icon: Heart, desc: 'We take only a 15% commission to cover standard platform operational fees, ensuring 85% goes directly to the workshop.' },
              { title: 'Eco Sustainable', icon: HelpCircle, desc: 'Promoting local clay, wood, dyes, and organic raw materials harvested using environmentally sensitive methods.' }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-[#FAFAFA] border border-gray-100 rounded-3xl p-8 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="p-3 bg-[#8B1A1A]/10 text-[#8B1A1A] rounded-2xl w-fit">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-[#1E1E1E]">{value.title}</h3>
                  <p className="text-xs text-[#5A5A5A] leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B1A1A] to-[#8B1A1A]/95 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Sri Lankan Diaspora Market', val: '3 Million+' },
              { label: 'Annual Heritage Craft Exports', val: '$140 Million+' },
              { label: 'Vetted Artisan Guarantee', val: '100% Verified' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-4xl sm:text-5xl font-black text-[#D4890A]">{stat.val}</p>
                <p className="text-xs font-bold text-white/80 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section Placeholder */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-[#8B1A1A] tracking-tight">Our Team</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">The creators behind the registry</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: 'Pavithra Nandasena',
              initials: 'PN',
              designation: 'Chief Executive Officer & Co-Founder',
              description: 'Leads the overall vision and strategy of CraftSL, passionate about connecting Sri Lankan artisans with global markets.'
            },
            {
              name: 'Lahiru Perera',
              initials: 'LP',
              designation: 'Chief Technology Officer & Co-Founder',
              description: 'Drives the technology platform development, ensuring a seamless experience for artisans and buyers worldwide.'
            },
            {
              name: 'Cherub Weeratunge',
              initials: 'CW',
              designation: 'Head of Artisan Relations',
              description: 'Manages artisan onboarding and verification, building trusted relationships with craft communities across Sri Lanka.'
            },
            {
              name: 'Thisun Sandesh',
              initials: 'TS',
              designation: 'Head of Marketing & Growth',
              description: 'Leads digital marketing strategy and brand awareness, growing CraftSL\'s presence in international diaspora markets.'
            },
            {
              name: 'Rashmi Wijesuriya',
              initials: 'RW',
              designation: 'Head of Operations & Logistics',
              description: 'Oversees order fulfilment, shipping partnerships, and ensures timely delivery of authentic Sri Lankan crafts globally.'
            },
            {
              name: 'Sithari Adikari',
              initials: 'SA',
              designation: 'Head of Finance & Compliance',
              description: 'Manages financial planning, fair trade compliance, and ensures artisans receive their full 85% earnings on every sale.'
            }
          ].map((member, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-[#8B1A1A] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                {member.initials}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-[#1E1E1E]">{member.name}</h3>
                <p className="text-xs font-bold text-[#D4890A]">{member.designation}</p>
                <p className="text-[11px] text-[#5A5A5A] leading-relaxed pt-1">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
