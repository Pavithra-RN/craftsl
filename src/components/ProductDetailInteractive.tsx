'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartProvider';
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ShieldCheck, 
  MapPin, 
  Check, 
  ChevronLeft 
} from 'lucide-react';

interface ProductDetailProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProduct: any;
}

const getFallbackImages = (craftType: string): string[] => {
  switch (craftType?.toLowerCase()) {
    case 'woodwork':
      return [
        'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
      ];
    case 'batik':
      return [
        'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1567401893930-79072f3531a4?auto=format&fit=crop&q=80&w=800',
      ];
    case 'pottery':
      return [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&q=80&w=800',
      ];
    case 'gems':
      return [
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      ];
    case 'weaving':
      return [
        'https://images.unsplash.com/photo-1584992236310-6edddc085ff8?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
      ];
    case 'lacquerwork':
    default:
      return [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      ];
  }
};

export default function ProductDetailInteractive({ initialProduct }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [product] = useState(initialProduct);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Extract or generate product images
  const productImages = React.useMemo(() => {
    const rawImages = product.images || [];
    if (rawImages.length > 0) {
      return rawImages;
    }
    // Fallback based on craft type
    return getFallbackImages(product.craft_type);
  }, [product.images, product.craft_type]);

  // Set initial active image
  useEffect(() => {
    if (productImages.length > 0) {
      setActiveImage(productImages[0]);
    }
  }, [productImages]);

  const handleQuantityMinus = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleQuantityPlus = () => {
    const maxStock = product.stock_quantity ?? 10;
    setQuantity(prev => Math.min(maxStock, prev + 1));
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      artisanName: artisan.display_name,
      artisanId: artisan.id,
      image: productImages.length > 0 ? productImages[0] : null
    }, quantity);
    triggerToast(`Added ${quantity} x "${product.title}" to your cart!`);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      artisanName: artisan.display_name,
      artisanId: artisan.id,
      image: productImages.length > 0 ? productImages[0] : null
    }, quantity);
    router.push('/checkout');
  };

  const getBadgeStyle = (craft: string) => {
    switch (craft?.toLowerCase()) {
      case 'batik':
        return 'bg-[#8B1A1A]/10 text-[#8B1A1A] border-[#8B1A1A]/20';
      case 'pottery':
        return 'bg-[#D4890A]/10 text-[#D4890A] border-[#D4890A]/20';
      case 'woodwork':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'gems':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'weaving':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'lacquerwork':
        return 'bg-[#8B1A1A]/5 text-[#8B1A1A] border-[#8B1A1A]/10';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const artisan = product.artisans || {
    display_name: 'Verified Guild Artisan',
    bio: 'Dedicated local Sri Lankan craftsperson, masterfully preserving generational crafting traditions.',
    craft_type: product.craft_type || 'other',
    region: 'Sri Lanka',
    verified: true,
    profile_image_url: null
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#8B1A1A] text-white px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in-up border border-[#D4890A]/20">
          <Check className="h-4.5 w-4.5 text-[#D4890A]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A5A5A] hover:text-[#8B1A1A] mb-8 transition-colors group"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Catalog
      </Link>

      {/* Two Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Left Column: Product Images */}
        <div className="lg:col-span-6 space-y-6">
          {/* Large Main Image Container */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500"
                sizes="(max-w-7xl) 50vw, 100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-[#8B1A1A]/5 flex flex-col items-center justify-center p-4">
                <ShoppingBag className="h-16 w-16 text-[#8B1A1A]/20 mb-3" />
                <span className="text-xs font-bold text-[#8B1A1A]/50 uppercase tracking-widest bg-white px-3 py-1 rounded border border-[#8B1A1A]/10">
                  {product.craft_type}
                </span>
              </div>
            )}
          </div>

          {/* Row of Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="flex flex-wrap gap-3">
              {productImages.map((imgUrl: string, index: number) => {
                const isActive = imgUrl === activeImage;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100 border-2 transition-all ${
                      isActive 
                        ? 'border-[#8B1A1A] scale-102 ring-2 ring-[#8B1A1A]/10' 
                        : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Actions & Details */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            {/* Craft Badge and Stars */}
            <div className="flex flex-wrap items-center gap-4">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getBadgeStyle(product.craft_type)}`}>
                {product.craft_type}
              </span>
              
              {/* Star rating placeholder (5 empty stars) */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 text-gray-200" />
                ))}
                <span className="text-xs text-gray-400 font-semibold ml-1.5">(No Reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E1E1E] leading-tight">
              {product.title}
            </h1>

            {/* Price in LKR (large, gold color) */}
            <div className="text-2xl sm:text-3xl font-black text-[#D4890A] flex items-baseline gap-1">
              <span className="text-base font-bold">LKR</span>
              <span>{product.price.toLocaleString()}</span>
            </div>

            <hr className="border-gray-100" />

            {/* Description Text */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Description</h3>
              <p className="text-sm text-[#5A5A5A] leading-relaxed">
                {product.description || 'No description provided by the artisan.'}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/70 border border-gray-100 rounded-2xl p-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Quantity</span>
                <span className="text-xs font-semibold text-gray-500">
                  {product.stock_quantity > 0 
                    ? `${product.stock_quantity} pieces available` 
                    : 'Out of stock'}
                </span>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={handleQuantityMinus}
                  disabled={quantity <= 1}
                  className="p-3 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 text-sm font-extrabold text-[#1E1E1E] min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleQuantityPlus}
                  disabled={quantity >= (product.stock_quantity ?? 10)}
                  className="p-3 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 text-white font-bold text-sm py-4 shadow-lg shadow-[#8B1A1A]/10 active:scale-98 transition-all"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full inline-flex items-center justify-center rounded-xl border-2 border-[#D4890A] hover:bg-[#D4890A]/5 text-[#D4890A] font-bold text-sm py-4 active:scale-98 transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Artisan Info Card */}
      <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 mt-12">
        {/* Profile Image */}
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-[#D4890A]/10 shrink-0 shadow-sm bg-gray-50">
          {artisan.profile_image_url ? (
            <Image
              src={artisan.profile_image_url}
              alt={artisan.display_name}
              fill
              className="object-cover"
              sizes="120px"
            />
          ) : (
            <div className="absolute inset-0 bg-[#8B1A1A]/10 text-[#8B1A1A] flex items-center justify-center text-3xl font-black uppercase">
              {artisan.display_name.charAt(0)}
            </div>
          )}
        </div>

        {/* Biography & Details */}
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-[#1E1E1E]">
                {artisan.display_name}
              </h2>
              {artisan.verified && (
                <span className="inline-flex items-center gap-1 bg-[#D4890A]/10 border border-[#D4890A]/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#D4890A] uppercase shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Artisan
                </span>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-[#5A5A5A] font-medium">
              <span className="bg-gray-100 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase text-gray-600 tracking-wider">
                {artisan.craft_type}
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-[#8B1A1A]" />
                <span>{artisan.region}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#5A5A5A] leading-relaxed max-w-3xl">
            {artisan.bio}
          </p>

          <div className="pt-2">
            <Link
              href={`/artisans/${artisan.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[#1E1E1E] font-bold text-xs px-6 py-3.5 transition-colors shadow-sm"
            >
              View Artisan Profile
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
