'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/providers/CartProvider';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalCount } = useCart();
  const [navUser, setNavUser] = useState<User | null>(null);
  const [navName, setNavName] = useState('');
  const [navRole, setNavRole] = useState('');
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Get current session immediately
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('Navbar session check:', session?.user?.email, error)
      if (session?.user) {
        setNavUser(session.user);
        // Get name from user metadata first (fastest)
        const name = session.user.user_metadata?.full_name || 
                     session.user.email?.split('@')[0] || 
                     'User';
        setNavName(name);
        
        // Then try to get from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          if (profile.full_name) {
            setNavName(profile.full_name);
          }
          if (profile.role) {
            setNavRole(profile.role);
          }
        }
      }
      setNavLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setNavUser(session.user);
          const name = session.user.user_metadata?.full_name ||
                       session.user.email?.split('@')[0] ||
                       'User';
          setNavName(name);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            if (profile.full_name) setNavName(profile.full_name);
            if (profile.role) setNavRole(profile.role);
          }
        } else {
          setNavUser(null);
          setNavName('');
          setNavRole('');
        }
        setNavLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('craftsl-auth')
    localStorage.removeItem('craftsl_cart')
    setNavUser(null)
    setNavName('')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.replace('/')
  }

  const role = navRole;

  const renderAuthSection = () => {
    if (navLoading) {
      return <div style={{width: '140px', height: '36px'}} />;
    }

    if (navUser) {
      return (
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <span style={{fontSize: '14px', color: '#374151'}}>
            Hello, <strong>{navName}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#8B1A1A',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        <Link href="/login">
          <button style={{
            backgroundColor: 'transparent',
            color: '#8B1A1A',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '2px solid #8B1A1A',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Login
          </button>
        </Link>
        <Link href="/register">
          <button style={{
            backgroundColor: '#8B1A1A',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Register
          </button>
        </Link>
      </div>
    );
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md transition-shadow duration-300 hover:shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="CraftSL — Sri Lankan Artisan Marketplace"
                width={185}
                height={70}
                className="h-14 sm:h-16 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {[
              { label: 'Shop', href: '/products' },
              { label: 'Artisans', href: '/artisans' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative py-2 text-sm font-medium text-[#5A5A5A] hover:text-[#8B1A1A] transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#8B1A1A] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {role === 'artisan' && (
              <Link
                href="/dashboard"
                className="relative py-2 text-sm font-medium text-[#8B1A1A] hover:text-[#8B1A1A]/80 transition-colors duration-200 group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#8B1A1A] transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
            {role === 'admin' && (
              <Link
                href="/admin"
                className="relative py-2 text-sm font-medium text-[#8B1A1A] hover:text-[#8B1A1A]/80 transition-colors duration-200 group"
              >
                Admin
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#8B1A1A] transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </nav>

          {/* Action Buttons (Right) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2.5 text-[#5A5A5A] hover:text-[#8B1A1A] hover:bg-gray-50 rounded-full transition-all duration-200 group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6 transition-transform duration-200 group-hover:scale-105" />
              {totalCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0077A8] text-[10px] font-bold text-white ring-2 ring-white animate-fade-in shadow-sm">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 border-l border-gray-100 pl-6 text-sm">
              {renderAuthSection()}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-[#5A5A5A] hover:text-[#8B1A1A]"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0077A8] text-[10px] font-bold text-white ring-2 ring-white">
                  {totalCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-[#5A5A5A] hover:bg-gray-50 hover:text-[#8B1A1A] rounded-lg transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[28rem]' : 'max-h-0'
        }`}
      >
        <div className="space-y-1 px-4 pb-6 pt-2 bg-white">
          <Link
            href="/products"
            className="block rounded-lg px-4 py-3 text-base font-medium text-[#5A5A5A] hover:bg-gray-50 hover:text-[#8B1A1A] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/artisans"
            className="block rounded-lg px-4 py-3 text-base font-medium text-[#5A5A5A] hover:bg-gray-50 hover:text-[#8B1A1A] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Artisans
          </Link>
          <Link
            href="/about"
            className="block rounded-lg px-4 py-3 text-base font-medium text-[#5A5A5A] hover:bg-gray-50 hover:text-[#8B1A1A] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          {role === 'artisan' && (
            <Link
              href="/dashboard"
              className="block rounded-lg px-4 py-3 text-base font-medium text-[#8B1A1A] hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {role === 'admin' && (
            <Link
              href="/admin"
              className="block rounded-lg px-4 py-3 text-base font-medium text-[#8B1A1A] hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
          <div className="mt-6 border-t border-gray-100 pt-6 flex flex-col space-y-3 px-4 text-sm">
            {renderAuthSection()}
          </div>
        </div>
      </div>
    </header>
  );
}
