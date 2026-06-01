import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAFAFA] border-t border-gray-100 text-[#5A5A5A] font-sans">
      {/* Upper Grid Area */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Tagline & About */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="CraftSL"
                width={132}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-[#5A5A5A]">
              An authentic marketplace connecting Sri Lankan artisan craftspeople with global buyers. We celebrate traditional craftsmanship, preserve heritage, and empower local communities.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 text-[#5A5A5A] hover:text-white hover:bg-[#8B1A1A] hover:border-[#8B1A1A] transition-all duration-300 shadow-sm active:scale-95"
                aria-label="Facebook"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 text-[#5A5A5A] hover:text-white hover:bg-[#8B1A1A] hover:border-[#8B1A1A] transition-all duration-300 shadow-sm active:scale-95"
                aria-label="Instagram"
              >
                <svg className="h-4.5 w-4.5" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-100 text-[#5A5A5A] hover:text-white hover:bg-[#8B1A1A] hover:border-[#8B1A1A] transition-all duration-300 shadow-sm active:scale-95"
                aria-label="Twitter"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E1E1E]">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Batik & Textiles', href: '/products?craft_type=batik' },
                { label: 'Clay & Ceramics', href: '/products?craft_type=pottery' },
                { label: 'Wood Carvings & Masks', href: '/products?craft_type=woodwork' },
                { label: 'Gems & Jewellery', href: '/products?craft_type=gems' },
                { label: 'Handloom Weaving', href: '/products?craft_type=weaving' },
                { label: 'Lacquerwork', href: '/products?craft_type=lacquerwork' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#8B1A1A] transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Artisans Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E1E1E]">Artisans</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Meet the Makers', href: '/artisans' },
                { label: 'Our Heritage Stories', href: '/stories' },
                { label: 'Artisan Application', href: '/artisans/apply' },
                { label: 'Fair Trade Policy', href: '/fair-trade' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#8B1A1A] transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E1E1E]">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'How it Works', href: '/how-it-works' },
                { label: 'Sustainability Impact', href: '/impact' },
                { label: 'Contact Support', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#8B1A1A] transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            
            {/* Copyright */}
            <div>
              <p>© {currentYear} CraftSL. All rights reserved. Connecting heritage with the world.</p>
            </div>

            {/* Micro badge: Made in SL */}
            <div className="flex items-center space-x-1 text-[#D4890A] bg-[#D4890A]/5 px-3 py-1.5 rounded-full border border-[#D4890A]/10 font-semibold">
              <Compass className="h-3.5 w-3.5 animate-spin-slow" />
              <span>Preserving Sri Lankan Craftsmanship</span>
              <Heart className="h-3 w-3 fill-[#8B1A1A] text-[#8B1A1A] ml-1" />
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-[#8B1A1A] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#8B1A1A] transition-colors">
                Terms of Service
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
