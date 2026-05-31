import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  Check, 
  MapPin, 
  ShieldCheck, 
  ShoppingBag, 
  ChevronLeft 
} from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

// Fallback mock data for testing/preview before items are fully seeded in DB
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_ARTISANS: Record<string, any> = {
  'artisan_1': {
    id: 'artisan_1',
    display_name: 'Galle Mask Artisans',
    bio: 'A family guild of woodcarvers passing down traditional mask sculpting techniques for over four generations in Ambalangoda, Southern Sri Lanka.',
    craft_type: 'woodwork',
    region: 'Ambalangoda',
    verified: true,
    profile_image_url: null,
    profiles: {
      full_name: 'Somasiri Wijesinghe',
      email: 'somasiri@gallemasks.lk'
    }
  },
  'artisan_2': {
    id: 'artisan_2',
    display_name: 'Kanthi Batik Handloom',
    bio: 'Master batik craftswoman Kanthi Perera runs a cooperative empowering over 15 rural women artisans in Matara, keeping the wax-resist dyeing traditions alive.',
    craft_type: 'batik',
    region: 'Matara',
    verified: true,
    profile_image_url: null,
    profiles: {
      full_name: 'Kanthi Perera',
      email: 'kanthi@matarabatik.lk'
    }
  },
  'artisan_3': {
    id: 'artisan_3',
    display_name: 'Alwis Earthen Pots',
    bio: 'Dharmadasa Alwis operates his family pottery wheel in the clay-rich fields of Kegalle, creating functional earthenware using ancestral clay-firing methods.',
    craft_type: 'pottery',
    region: 'Kegalle',
    verified: true,
    profile_image_url: null,
    profiles: {
      full_name: 'Dharmadasa Alwis',
      email: 'dharmadasa@kegalclay.lk'
    }
  },
  'artisan_4': {
    id: 'artisan_4',
    display_name: 'Pilimatalawa Brass Guild',
    bio: 'Gathering local metalworkers in Pilimatalawa near Kandy, this guild specializes in hand-beaten brass and traditional bronze oil lamps.',
    craft_type: 'other',
    region: 'Pilimatalawa',
    verified: true,
    profiles: {
      full_name: 'Ranasinghe Bandara',
      email: 'bandara@brassguild.lk'
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_PRODUCTS: Record<string, any[]> = {
  'artisan_1': [
    {
      id: '1',
      title: 'Maha Kola Sanni Wood Mask',
      price: 18500,
      craft_type: 'woodwork',
      images: [
        'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=800'
      ],
      is_active: true
    }
  ],
  'artisan_2': [
    {
      id: '2',
      title: 'Traditional Silk Batik Sarong',
      price: 9500,
      craft_type: 'batik',
      images: [
        'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800'
      ],
      is_active: true
    }
  ],
  'artisan_3': [
    {
      id: '3',
      title: 'Earthen Clay Terracotta Pot',
      price: 3200,
      craft_type: 'pottery',
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800'
      ],
      is_active: true
    }
  ],
  'artisan_4': [
    {
      id: '4',
      title: 'Hand-Polished Brass Oil Lamp',
      price: 14200,
      craft_type: 'other',
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
      ],
      is_active: true
    }
  ]
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  let title = "Sri Lankan Artisan Profile | CraftSL";
  let description = "Meet authentic Sri Lankan artisans preserving generational heritage crafts.";

  if (MOCK_ARTISANS[id]) {
    const art = MOCK_ARTISANS[id];
    title = `${art.display_name} - Verified Artisan | CraftSL`;
    description = `Discover ${art.display_name} from ${art.region}, specialized in ${art.craft_type} crafts: ${art.bio}`;
  } else {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('artisans')
        .select('display_name, region, craft_type, bio')
        .eq('id', id)
        .single();
      
      if (data) {
        title = `${data.display_name} - Verified Artisan | CraftSL`;
        description = `Discover ${data.display_name} from ${data.region}, specialized in ${data.craft_type} crafts: ${data.bio}`;
      }
    } catch {
      // Ignore postgres UUID error in metadata resolver
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile'
    }
  };
}

export default async function ArtisanProfilePage({ params }: PageProps) {
  const { id } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let artisan: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];

  if (MOCK_ARTISANS[id]) {
    artisan = MOCK_ARTISANS[id];
    products = MOCK_PRODUCTS[id] || [];
  } else {
    try {
      const supabase = createClient();
      
      // Fetch artisan joined with profiles
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisans')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();

      if (!artisanError && artisanData) {
        artisan = artisanData;

        // Fetch active products for this artisan
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*, artisans(display_name, verified)')
          .eq('artisan_id', artisan.id)
          .eq('is_active', true);

        if (!productError && productData) {
          products = productData;
        }
      }
    } catch (err) {
      console.error("Error loading artisan profile server client:", err);
    }
  }

  // If artisan does not exist OR is unverified, redirect to products listing
  if (!artisan || !artisan.verified) {
    redirect('/products');
  }

  // Pill badge style
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

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#1E1E1E] pb-16">
      
      {/* 1. PROFILE HEADER SECTION (Maroon background) */}
      <section className="relative w-full bg-[#8B1A1A] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-[#D4890A]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          
          {/* Circular large profile image */}
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-[#D4890A]/35 bg-white/10 shrink-0 shadow-lg flex items-center justify-center">
            {artisan.profile_image_url ? (
              <Image
                src={artisan.profile_image_url}
                alt={artisan.display_name}
                fill
                className="object-cover"
                sizes="(max-w-768px) 120px, 150px"
              />
            ) : (
              <span className="text-white text-4xl sm:text-5xl font-black uppercase">
                {artisan.display_name.charAt(0)}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-2">
              {/* Back breadcrumb */}
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 hover:text-white transition-colors mb-2"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back to Shop
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
                {artisan.display_name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm">
              {/* Craft Pill */}
              <span className="bg-[#D4890A] text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                {artisan.craft_type}
              </span>

              <span className="text-white/40">•</span>

              {/* Region */}
              <div className="flex items-center text-white/90">
                <MapPin className="h-4 w-4 text-[#D4890A] mr-1" />
                <span>{artisan.region}</span>
              </div>

              <span className="text-white/40">•</span>

              {/* Verified Badge */}
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                Verified Artisan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 2. ABOUT SECTION */}
        <section className="lg:col-span-12 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#1E1E1E]">
              About {artisan.display_name}
            </h2>
            <hr className="border-gray-50" />
          </div>

          <p className="text-sm sm:text-base text-[#5A5A5A] leading-relaxed max-w-4xl whitespace-pre-line">
            {artisan.bio}
          </p>

          {/* Two Stat Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg pt-2">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col justify-center shadow-inner">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Products Listed</span>
              <p className="text-2xl font-black text-[#8B1A1A] mt-1">{products.length} Items</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col justify-center shadow-inner">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Discipline</span>
              <p className="text-2xl font-black text-[#D4890A] mt-1 capitalize">{artisan.craft_type}</p>
            </div>
          </div>
        </section>

        {/* 3. PRODUCTS SECTION */}
        <section className="lg:col-span-12 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#1E1E1E]">
              {artisan.display_name}&apos;s Collection
            </h2>
            <p className="text-xs text-[#5A5A5A] uppercase tracking-wider font-semibold">
              Browse authentic items available direct from workshop
            </p>
            <hr className="border-gray-100" />
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-3">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold text-[#5A5A5A]">
                This artisan has not listed any products yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => {
                const firstImage = prod.images && prod.images.length > 0 ? prod.images[0] : null;
                const isVerified = artisan.verified === true;

                return (
                  <div 
                    key={prod.id} 
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={prod.title}
                          fill
                          className="object-cover group-hover:scale-103 transition-transform duration-500"
                          sizes="(max-w-768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#8B1A1A]/5 flex flex-col items-center justify-center p-4">
                          <ShoppingBag className="h-10 w-10 text-[#8B1A1A]/20 mb-2" />
                          <span className="text-[9px] font-extrabold text-[#8B1A1A]/55 uppercase tracking-widest bg-white border border-[#8B1A1A]/10 px-2.5 py-1 rounded-md">
                            {prod.craft_type}
                          </span>
                        </div>
                      )}

                      {/* Craft badge overlay */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${getBadgeStyle(prod.craft_type)}`}>
                          {prod.craft_type}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Details */}
                    <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A]">
                          <span className="truncate max-w-[150px] font-medium">
                            {artisan.display_name}
                          </span>
                          {isVerified && (
                            <span title="Verified Artisan" className="shrink-0">
                              <ShieldCheck className="h-4 w-4 text-[#D4890A] fill-[#D4890A]/10" />
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-[#1E1E1E] line-clamp-1 group-hover:text-[#8B1A1A] transition-colors" title={prod.title}>
                          {prod.title}
                        </h3>
                      </div>

                      {/* Actions & Price Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
                          <span className="font-black text-base text-[#1E1E1E]">
                            LKR {prod.price.toLocaleString()}
                          </span>
                        </div>
                        
                        <Link
                          href={`/products/${prod.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-gray-50 hover:bg-[#8B1A1A] hover:text-white border border-gray-200 hover:border-[#8B1A1A] px-4 py-2.5 text-xs font-bold text-[#1E1E1E] transition-all"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. TRUST SECTION */}
        <section className="lg:col-span-12">
          <div className="bg-[#8B1A1A]/5 border-l-4 border-[#8B1A1A] rounded-r-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-[#8B1A1A] uppercase tracking-wider leading-relaxed">
              All products by this artisan have been verified by the CraftSL team for authenticity and quality.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
