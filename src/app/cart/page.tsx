'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/providers/CartProvider';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  Lock,
  ChevronLeft
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalCount } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8B1A1A]"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      
      {/* Header breadcrumbs */}
      <div className="mb-8 space-y-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5A5A5A] hover:text-[#8B1A1A] transition-colors mb-2 group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Your Shopping <span className="text-[#8B1A1A]">Cart</span>
        </h1>
        <p className="text-sm text-[#5A5A5A]">
          Review your authentic handloom textiles, woodcarvings, and local treasures before checkout.
        </p>
      </div>

      {cart.length === 0 ? (
        // Empty Cart State
        <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm flex flex-col items-center space-y-5">
          <div className="p-5 bg-[#8B1A1A]/5 rounded-full text-[#8B1A1A] animate-pulse">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-[#1E1E1E]">Your Cart is Empty</h2>
            <p className="text-xs text-[#5A5A5A] max-w-md leading-relaxed">
              It looks like you haven&apos;t added any traditional Sri Lankan creations to your cart yet. Explore our curated collections from verified regional artisans.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] px-8 py-3.5 text-xs font-bold text-white shadow hover:bg-[#8B1A1A]/95 transition-all"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        // Two Column Cart Grid
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#1E1E1E] pb-3 border-b border-gray-50 flex items-center justify-between">
                <span>Items ({totalCount})</span>
                <span className="text-xs font-normal text-gray-400">Directly from artisan workshops</span>
              </h2>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-stretch sm:items-center">
                    
                    {/* Item Image */}
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#8B1A1A]/5 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-[#8B1A1A]/20" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-sm sm:text-base text-[#1E1E1E] hover:text-[#8B1A1A] transition-colors line-clamp-1">
                          <Link href={`/products/${item.id}`}>{item.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">
                          By <span className="font-semibold text-gray-600">{item.artisanName}</span>
                        </p>
                      </div>
                      
                      {/* Price Display */}
                      <span className="font-black text-sm text-[#D4890A] mt-2 block sm:hidden">
                        LKR {item.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity & Price Panel */}
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm scale-90">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-xs font-extrabold text-[#1E1E1E] min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Desktop Price */}
                      <span className="hidden sm:block font-black text-sm sm:text-base text-[#D4890A] min-w-[100px] text-right">
                        LKR {item.price.toLocaleString()}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2.5 rounded-xl border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-[#1E1E1E] pb-3 border-b border-gray-50">
              Order Summary
            </h2>

            <div className="space-y-4 text-xs font-semibold text-[#5A5A5A]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-[#1E1E1E]">LKR {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Platform Fee</span>
                <span className="text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2.5 py-0.5 rounded-md">Free</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Estimated Shipping</span>
                <span className="text-gray-400 italic">Calculated at checkout</span>
              </div>

              <hr className="border-gray-50" />

              <div className="flex items-baseline justify-between text-sm pt-2">
                <span className="font-bold text-[#1E1E1E]">Total</span>
                <div className="text-lg font-black text-[#D4890A] flex items-baseline gap-1">
                  <span className="text-xs font-bold">LKR</span>
                  <span>{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Link
                href="/checkout"
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 text-white font-bold text-sm py-4 shadow-lg shadow-[#8B1A1A]/10 active:scale-98 transition-all group"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Lock className="h-3.5 w-3.5 text-[#D4890A]" />
                <span>Secure Checkout Powered by Stripe</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
