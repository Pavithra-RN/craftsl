'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  RotateCcw, 
  ShoppingBag,
  ArrowUpDown,
  Filter,
  X
} from 'lucide-react';

const CRAFT_TYPES = [
  { value: 'batik', label: 'Batik' },
  { value: 'pottery', label: 'Pottery' },
  { value: 'woodwork', label: 'Woodwork' },
  { value: 'gems', label: 'Gems' },
  { value: 'weaving', label: 'Weaving' },
  { value: 'lacquerwork', label: 'Lacquerwork' }
];

const ITEMS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, price_asc, price_desc
  const [page, setPage] = useState(1);

  // Debounced States (to limit API calls during drag/typing)
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(500000);

  // API Data State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mobile Filter Drawer Toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize filters from search parameters (e.g. from homepage category click or search submit)
  useEffect(() => {
    const craftTypeParam = searchParams.get('craft_type');
    const searchParam = searchParams.get('search');

    if (craftTypeParam) {
      const lowerCraft = craftTypeParam.toLowerCase();
      if (CRAFT_TYPES.some(c => c.value === lowerCraft)) {
        setSelectedCrafts([lowerCraft]);
      }
    }

    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParams]);

  // Debounce search and price slider changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedMaxPrice(maxPrice);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, maxPrice]);

  // Fetch products from Supabase whenever filters/pagination/sorting states change
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
        const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

        let url = `${SUPABASE_URL}/rest/v1/products?is_active=eq.true`

        // Select string
        let selectString = '*,artisans(id,display_name,verified,region,craft_type)';
        if (verifiedOnly) {
          selectString = '*,artisans!inner(id,display_name,verified,region,craft_type)';
          url += `&artisans.verified=eq.true`
        }
        url += `&select=${selectString}`

        // Filter by Title Search
        if (debouncedSearch.trim() !== '') {
          url += `&title=ilike.*${encodeURIComponent(debouncedSearch)}*`
        }

        // Filter by Craft Types
        if (selectedCrafts.length > 0) {
          url += `&craft_type=in.(${selectedCrafts.join(',')})`
        }

        // Filter by Price Range
        url += `&price=gte.0&price=lte.${debouncedMaxPrice}`

        // Apply Sorting
        if (sortBy === 'price_asc') {
          url += `&order=price.asc`
        } else if (sortBy === 'price_desc') {
          url += `&order=price.desc`
        } else {
          url += `&order=created_at.desc`
        }

        // Pagination range
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const res = await fetch(url, {
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
            'Range': `${from}-${to}`,
            'Prefer': 'count=exact'
          }
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`)
        }

        const data = await res.json()
        
        // Get total count from Content-Range header
        const contentRange = res.headers.get('content-range')
        let count = 0
        if (contentRange) {
          const parts = contentRange.split('/')
          if (parts.length > 1) {
            count = parseInt(parts[1], 10)
          }
        }

        if (isMounted) {
          if (Array.isArray(data)) {
            setProducts(data)
            setTotalCount(count)
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Unexpected error fetching products:", err);
          setError(err instanceof Error ? err.message : 'Failed to retrieve products catalog.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedCrafts, debouncedMaxPrice, verifiedOnly, sortBy, page]);

  // Reset pagination to page 1 whenever filters change
  const handleCraftChange = (craftValue: string) => {
    setPage(1);
    setSelectedCrafts(prev => {
      if (prev.includes(craftValue)) {
        return prev.filter(c => c !== craftValue);
      } else {
        return [...prev, craftValue];
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCrafts([]);
    setMaxPrice(500000);
    setVerifiedOnly(false);
    setSortBy('newest');
    setPage(1);
    // Clear url query params
    router.replace('/products');
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Craft type pill styles
  const getBadgeStyle = (craft: string) => {
    switch (craft.toLowerCase()) {
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Page Title Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E1E1E]">
          Sri Lankan Artisan <span className="text-[#8B1A1A]">Catalog</span>
        </h1>
        <p className="text-sm text-[#5A5A5A] max-w-xl">
          Support verified home-grown talent and purchase directly from island-wide workshops.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Filter Container (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h2 className="font-extrabold text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-[#8B1A1A]" />
              Filters
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#8B1A1A] hover:text-[#D4890A] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            {/* Craft Types Checkboxes */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#5A5A5A]">Craft Type</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-sm cursor-pointer font-medium select-none">
                  <input
                    type="checkbox"
                    checked={selectedCrafts.length === 0}
                    onChange={() => {
                      setSelectedCrafts([]);
                      setPage(1);
                    }}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                  />
                  <span>All Crafts</span>
                </label>

                {CRAFT_TYPES.map((craft) => (
                  <label key={craft.value} className="flex items-center gap-3 text-sm cursor-pointer font-medium select-none">
                    <input
                      type="checkbox"
                      checked={selectedCrafts.includes(craft.value)}
                      onChange={() => handleCraftChange(craft.value)}
                      className="h-4.5 w-4.5 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                    />
                    <span>{craft.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#5A5A5A]">Max Price</h3>
                <span className="text-xs font-extrabold text-[#8B1A1A]">
                  LKR {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500000"
                step="1000"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B1A1A]"
              />
              <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                <span>0 LKR</span>
                <span>500,000 LKR</span>
              </div>
            </div>

            {/* Verified Artisan Toggle */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-[#1E1E1E]">Verified Artisans Only</span>
                  <p className="text-[10px] text-gray-400">Show only authenticated guilds</p>
                </div>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => {
                    setVerifiedOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="h-4.5 w-4.5 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Top Actions Row: Search, Mobile Filter Trigger, Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products by title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#1E1E1E] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] text-sm shadow-sm"
              />
              {search && (
                <button 
                  onClick={() => { setSearch(''); setPage(1); }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Actions: Sorting, Mobile Filter Button */}
            <div className="flex items-center gap-3 justify-between">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                <Filter className="h-4 w-4 text-[#8B1A1A]" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white shadow-sm">
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs font-semibold text-[#5A5A5A] focus:outline-none cursor-pointer pr-1"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Info */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#5A5A5A] uppercase tracking-wider">
              {loading ? 'Searching products...' : `Showing ${totalCount} products`}
            </span>
            {selectedCrafts.length > 0 && (
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-gray-400">Craft:</span>
                <span className="font-extrabold text-[#8B1A1A] uppercase">
                  {selectedCrafts.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Grid Layout & Fetch Loader */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-3xl p-4 space-y-4 animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-2xl w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="flex justify-between pt-2">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-[#8B1A1A]/5 border border-[#8B1A1A]/10 text-[#8B1A1A] p-6 rounded-2xl text-center space-y-2">
              <p className="font-extrabold text-base">Error Loading Catalog</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center space-y-4 shadow-sm flex flex-col items-center">
              <div className="p-4 bg-[#8B1A1A]/5 rounded-full text-[#8B1A1A]">
                <ShoppingBag className="h-10 w-10 opacity-70" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-[#1E1E1E]">No Products Found</h3>
                <p className="text-xs text-[#5A5A5A] max-w-sm leading-relaxed">
                  We could not find any active product listings matching your current filtering criteria. Try resetting or adjusting the options.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] px-6 py-3 text-xs font-bold text-white shadow hover:bg-[#8B1A1A]/95 transition-all"
              >
                Reset Filter Choices
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => {
                  const firstImage = prod.images && prod.images.length > 0 ? prod.images[0] : null;
                  const isVerified = prod.artisans?.verified === true;

                  return (
                    <div 
                      key={prod.id} 
                      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group"
                    >
                      {/* Image Area */}
                      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                        {firstImage ? (
                          <Image
                            src={firstImage}
                            alt={prod.title}
                            fill
                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                            sizes="(max-w-7xl) 50vw, (max-w-1024px) 33vw, 25vw"
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
                              {prod.artisans?.display_name || 'Verified Guild'}
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-6 px-1">
                  <button
                    disabled={page === 1}
                    onClick={() => { setPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white text-[#1E1E1E] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <span className="text-xs font-extrabold text-[#5A5A5A]">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => { setPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold bg-white text-[#1E1E1E] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:pointer-events-none shadow-sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Mobile Drawer Slide-out Filter (Mobile Only) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-6 px-6 shadow-2xl transition-transform duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="font-extrabold text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#8B1A1A]" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              {/* Reset filter inside Drawer */}
              <button
                onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-extrabold transition-colors"
              >
                <RotateCcw className="h-3 w-3 text-[#8B1A1A]" />
                Reset Filter Choices
              </button>

              {/* Craft Types */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#5A5A5A]">Craft Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm cursor-pointer font-medium select-none">
                    <input
                      type="checkbox"
                      checked={selectedCrafts.length === 0}
                      onChange={() => {
                        setSelectedCrafts([]);
                        setPage(1);
                      }}
                      className="h-4.5 w-4.5 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                    />
                    <span>All Crafts</span>
                  </label>

                  {CRAFT_TYPES.map((craft) => (
                    <label key={craft.value} className="flex items-center gap-3 text-sm cursor-pointer font-medium select-none">
                      <input
                        type="checkbox"
                        checked={selectedCrafts.includes(craft.value)}
                        onChange={() => handleCraftChange(craft.value)}
                        className="h-4.5 w-4.5 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                      />
                      <span>{craft.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-[#5A5A5A]">Max Price</h3>
                  <span className="text-xs font-extrabold text-[#8B1A1A]">
                    LKR {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B1A1A]"
                />
              </div>

              {/* Verified Artisan Toggle */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-[#1E1E1E]">Verified Artisans Only</span>
                    <p className="text-[10px] text-gray-400">Show only authenticated guilds</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => {
                      setVerifiedOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                  />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3.5 bg-[#8B1A1A] text-white hover:bg-[#8B1A1A]/95 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8B1A1A]"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
