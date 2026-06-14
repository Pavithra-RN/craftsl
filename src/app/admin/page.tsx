'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  ArrowRight,
  Eye,
  EyeOff,
  User as UserIcon,
  TrendingUp,
  Percent,
  Clock,
  FileText
} from 'lucide-react';

interface Profile {
  full_name: string;
  email: string;
}

interface ArtisanWithProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  craft_type: 'batik' | 'pottery' | 'woodwork' | 'gems' | 'weaving' | 'lacquerwork' | 'other';
  region: string;
  verified: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  profile_image_url: string | null;
  featured?: boolean;
  created_at: string;
  profiles: Profile | null;
}

interface ProductWithArtisan {
  id: string;
  artisan_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  craft_type: string;
  images: string[];
  stock_quantity: number;
  is_active: boolean;
  featured?: boolean;
  created_at: string;
  artisans: {
    display_name: string;
    craft_type: string;
  } | null;
}

interface OrderWithProfile {
  id: string;
  buyer_id: string | null;
  total_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  stripe_payment_intent_id: string | null;
  created_at: string;
  profiles: {
    email: string;
  } | null;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  artisan_id: string | null;
  quantity: number;
  unit_price: number;
  commission_rate: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'products' | 'orders'>('overview');
  const [verificationTab, setVerificationTab] = useState<'pending' | 'approved'>('pending');

  // Database States
  const [artisans, setArtisans] = useState<ArtisanWithProfile[]>([]);
  const [products, setProducts] = useState<ProductWithArtisan[]>([]);
  const [orders, setOrders] = useState<OrderWithProfile[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const [adminVerified, setAdminVerified] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      const raw = localStorage.getItem('craftsl-auth')
      if (!raw) { window.location.href = '/login'; return }
      
      const parsed = JSON.parse(raw)
      const userId = parsed?.user?.id
      const accessToken = parsed?.access_token
      
      if (!userId || !accessToken) {
        window.location.href = '/login'
        return
      }

      const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
      const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

      const headers = {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }

      // Check admin role
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role`,
        { headers }
      )
      const profiles = await profileRes.json()
      const role = profiles?.[0]?.role

      if (role !== 'admin') {
        window.location.href = '/'
        return
      }

      // Fetch stats
      const [artisansRes, productsRes, ordersRes, itemsRes] = 
        await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/artisans?select=*`, { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/products?select=*,artisans(id,display_name,craft_type)&order=created_at.desc`, { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/orders?select=*`, { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/order_items?select=*`, { headers })
        ])

      const artisansData = await artisansRes.json()
      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      const itemsData = await itemsRes.json()

      if (Array.isArray(artisansData)) setArtisans(artisansData as unknown as ArtisanWithProfile[])
      if (Array.isArray(productsData)) setProducts(productsData as unknown as ProductWithArtisan[])
      if (Array.isArray(ordersData)) setOrders(ordersData as unknown as OrderWithProfile[])
      if (Array.isArray(itemsData)) setOrderItems(itemsData as unknown as OrderItem[])
      
      setAdminEmail(parsed?.user?.email || '')
      setAdminVerified(true)
    };

    fetchAdminData();
  }, []);

  // Operations
  const handleApproveArtisan = async (artisanId: string) => {
    const raw = localStorage.getItem('craftsl-auth')
    if (!raw) return
    const parsed = JSON.parse(raw)
    const accessToken = parsed?.access_token
    
    const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/artisans?id=eq.${artisanId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ 
          verified: true, 
          verification_status: 'approved' 
        })
      }
    )

    console.log('Approve status:', res.status)

    if (res.ok) {
      setArtisans(prev => prev.map(a => {
        if (a.id === artisanId) {
          return { ...a, verified: true, 
            verification_status: 'approved' }
        }
        return a
      }))
    } else {
      alert('Failed to approve artisan.')
    }
  }

  const handleRejectArtisan = async (artisanId: string) => {
    const confirmReject = confirm(
      "Are you sure you want to reject this artisan?"
    )
    if (!confirmReject) return

    const raw = localStorage.getItem('craftsl-auth')
    if (!raw) return
    const parsed = JSON.parse(raw)
    const accessToken = parsed?.access_token

    const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/artisans?id=eq.${artisanId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ 
          verified: false, 
          verification_status: 'rejected' 
        })
      }
    )

    if (res.ok) {
      setArtisans(prev => prev.map(a => {
        if (a.id === artisanId) {
          return { ...a, verified: false, 
            verification_status: 'rejected' }
        }
        return a
      }))
    } else {
      alert('Failed to reject artisan.')
    }
  }

  const handleToggleProductStatus = async (productId: string, currentStatus: boolean) => {
    const raw = localStorage.getItem('craftsl-auth')
    if (!raw) return
    const parsed = JSON.parse(raw)
    const accessToken = parsed?.access_token

    const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ 
          is_active: !currentStatus
        })
      }
    )

    if (res.ok) {
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return { ...p, is_active: !currentStatus }
        }
        return p
      }))
    } else {
      alert('Failed to update product visibility status.')
    }
  }

  const handleToggleFeatured = async (
    productId: string, 
    currentFeatured: boolean | undefined
  ) => {
    const raw = localStorage.getItem('craftsl-auth')
    if (!raw) return
    const parsed = JSON.parse(raw)
    const accessToken = parsed?.access_token

    const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ featured: !currentFeatured })
      }
    )

    if (res.ok) {
      setProducts(prev => prev.map(p =>
        p.id === productId 
          ? { ...p, featured: !currentFeatured } 
          : p
      ))
    } else {
      alert('Failed to update featured status.')
    }
  }

  const handleToggleArtisanFeatured = async (
    artisanId: string,
    currentFeatured: boolean | undefined
  ) => {
    const raw = localStorage.getItem('craftsl-auth')
    if (!raw) return
    const parsed = JSON.parse(raw)
    const accessToken = parsed?.access_token

    const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/artisans?id=eq.${artisanId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ featured: !currentFeatured })
      }
    )

    if (res.ok) {
      setArtisans(prev => prev.map(a =>
        a.id === artisanId
          ? { ...a, featured: !currentFeatured }
          : a
      ))
    } else {
      alert('Failed to update featured status.')
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled') => {
    const raw = localStorage.getItem('craftsl-auth')
    if (!raw) return
    const parsed = JSON.parse(raw)
    const accessToken = parsed?.access_token

    const SUPABASE_URL = 'https://mmcxkgjbuscrrpuxxczs.supabase.co'
    const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ 
          status: newStatus
        })
      }
    )

    if (res.ok) {
      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, status: newStatus }
        }
        return o
      }))
    } else {
      alert('Failed to update order status.')
    }
  }

  // Helper Metrics Calculations
  const totalArtisans = artisans.length;
  const pendingArtisans = artisans.filter(a => a.verification_status === 'pending');
  const pendingArtisansCount = pendingArtisans.length;
  const approvedArtisans = artisans.filter(a => a.verified === true || a.verification_status === 'approved');
  const totalProducts = products.length;
  const totalOrders = orders.length;

  const totalPlatformRevenue = orderItems.reduce(
    (sum, item) => sum + (item.commission_rate * item.unit_price * item.quantity),
    0
  );

  const getOrderItemCount = (orderId: string) => {
    return orderItems
      .filter(item => item.order_id === orderId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getArtisanProductCount = (artisanId: string) => {
    return products.filter(p => p.artisan_id === artisanId).length;
  };

  const getArtisanTotalSales = (artisanId: string) => {
    return orderItems
      .filter(item => item.artisan_id === artisanId)
      .reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  if (!adminVerified) {
    return <div>Loading admin panel...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      
      {/* Admin Panel Header */}
      <header className="mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E1E] tracking-tight flex items-center">
            <ShieldCheck className="h-8 w-8 text-[#8B1A1A] mr-2.5 shrink-0" />
            <span>CraftSL Control Center</span>
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#8B1A1A] text-white border border-[#D4890A] tracking-wider uppercase shadow-sm">
              Admin
            </span>
          </h1>
          <p className="text-xs font-semibold text-gray-400 mt-1">Platform management and quality guarantee console</p>
        </div>
        <div className="text-xs font-semibold text-gray-500 bg-white border px-4 py-2 rounded-2xl w-fit shadow-sm">
          Active Admin Session: <strong className="text-[#8B1A1A]">{adminEmail}</strong>
        </div>
      </header>

      {/* Navigation Tabs (Maroon & Gold Theme) */}
      <nav className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'verification', label: 'Artisan Verification', icon: Users, badge: pendingArtisansCount > 0 ? pendingArtisansCount : undefined },
          { id: 'products', label: 'All Products', icon: ShoppingBag },
          { id: 'orders', label: 'All Orders', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'verification' | 'products' | 'orders')}
              className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-bold text-xs transition-all relative ${
                isSelected
                  ? 'border-[#8B1A1A] text-[#8B1A1A]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#8B1A1A] text-white border border-[#D4890A]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Panel Content views */}
      <main className="space-y-8">
        
        {/* SECTION 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Artisans', val: totalArtisans, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Pending Verification', val: pendingArtisansCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Products Listed', val: totalProducts, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Orders Placed', val: totalOrders, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Platform Revenue', val: `LKR ${Math.round(totalPlatformRevenue).toLocaleString()}`, icon: Percent, color: 'text-[#8B1A1A]', bg: 'bg-red-50' }
              ].map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden transition-all hover:shadow-md">
                    <div className={`p-2.5 rounded-2xl w-fit ${stat.bg} ${stat.color}`}>
                      <StatIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-base font-black mt-1 text-[#1E1E1E]">{stat.val}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions / Shortcuts Panel */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-base font-bold text-[#1E1E1E] mb-4 flex items-center">
                <ShieldCheck className="h-5 w-5 text-[#8B1A1A] mr-2" />
                Administrative Overview & Operations
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
                Welcome to the CraftSL marketplace control center. Use this administrative portal to vet craft workshops, moderate product catalogs, verify regional Sri Lankan heritage credentials, and maintain customer order dispatch statuses.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <button
                  onClick={() => { setActiveTab('verification'); setVerificationTab('pending'); }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-left hover:bg-amber-50 transition-all group"
                >
                  <div>
                    <h3 className="text-xs font-black text-amber-900">Vet Pending Artisans</h3>
                    <p className="text-[10px] text-amber-700 font-bold mt-0.5">{pendingArtisansCount} workshops awaiting review</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-600 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-left hover:bg-purple-50 transition-all group"
                >
                  <div>
                    <h3 className="text-xs font-black text-purple-900">Moderate Listings</h3>
                    <p className="text-[10px] text-purple-700 font-bold mt-0.5">{totalProducts} active and hidden crafts</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-600 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-left hover:bg-emerald-50 transition-all group"
                >
                  <div>
                    <h3 className="text-xs font-black text-emerald-900">Review Transactions</h3>
                    <p className="text-[10px] text-emerald-700 font-bold mt-0.5">{totalOrders} orders completed or pending</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Artisan Verification */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h2 className="text-base font-black flex items-center gap-2">
                <Users className="h-5 w-5 text-[#8B1A1A]" />
                Artisan Directory Vetting
              </h2>
              {/* Internal Tab Controls */}
              <div className="flex bg-gray-100 p-0.5 rounded-xl border">
                {[
                  { id: 'pending', label: `Pending (${pendingArtisansCount})` },
                  { id: 'approved', label: 'Approved & Active' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setVerificationTab(sub.id as 'pending' | 'approved')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all ${
                      verificationTab === sub.id
                        ? 'bg-white text-[#1E1E1E] shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {verificationTab === 'pending' ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold divide-y divide-gray-100">
                    <thead>
                      <tr className="text-gray-400 uppercase tracking-wider font-bold">
                        <th className="pb-3">Artisan Shop</th>
                        <th className="pb-3">Discipline</th>
                        <th className="pb-3">Region</th>
                        <th className="pb-3">Registered Date</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pendingArtisans.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-400 font-bold">
                            No pending artisan verifications found. Excellent!
                          </td>
                        </tr>
                      ) : (
                        pendingArtisans.map((artisan) => (
                          <tr key={artisan.id} className="text-gray-600">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-50 border shrink-0 flex items-center justify-center">
                                  {artisan.profile_image_url ? (
                                    <Image src={artisan.profile_image_url} alt={artisan.display_name} fill className="object-cover" sizes="36px" />
                                  ) : (
                                    <UserIcon className="h-4.5 w-4.5 text-[#8B1A1A]/30" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-extrabold text-[#1E1E1E]">{artisan.display_name}</p>
                                  <p className="text-[10px] text-gray-400 font-semibold">{artisan.profiles?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 capitalize font-bold text-gray-700">{artisan.craft_type}</td>
                            <td className="py-4 text-gray-600 font-bold">{artisan.region}</td>
                            <td className="py-4 text-gray-400">{new Date(artisan.created_at).toLocaleDateString()}</td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleApproveArtisan(artisan.id)}
                                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border border-emerald-200"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectArtisan(artisan.id)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border border-red-200"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold divide-y divide-gray-100">
                    <thead>
                      <tr className="text-gray-400 uppercase tracking-wider font-bold">
                        <th className="pb-3">Artisan Shop</th>
                        <th className="pb-3">Craft Discipline</th>
                        <th className="pb-3">Operating Region</th>
                        <th className="pb-3 text-center">Listed Products</th>
                        <th className="pb-3 text-right">Cumulative Sales</th>
                        <th className="pb-3 text-center">Verification Status</th>
                        <th className="pb-3 text-center">Homepage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {approvedArtisans.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-400 font-bold">
                            No verified artisans found on the database.
                          </td>
                        </tr>
                      ) : (
                        approvedArtisans.map((artisan) => (
                          <tr key={artisan.id} className="text-gray-600">
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-gray-50 border shrink-0 flex items-center justify-center">
                                  {artisan.profile_image_url ? (
                                    <Image src={artisan.profile_image_url} alt={artisan.display_name} fill className="object-cover" sizes="36px" />
                                  ) : (
                                    <UserIcon className="h-4.5 w-4.5 text-[#8B1A1A]/30" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-extrabold text-[#1E1E1E]">{artisan.display_name}</p>
                                  <p className="text-[10px] text-gray-400 font-semibold">{artisan.profiles?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 capitalize font-bold text-gray-700">{artisan.craft_type}</td>
                            <td className="py-4 text-gray-600 font-bold">{artisan.region}</td>
                            <td className="py-4 text-center font-black text-gray-700">{getArtisanProductCount(artisan.id)} pcs</td>
                            <td className="py-4 text-right font-black text-[#D4890A]">LKR {getArtisanTotalSales(artisan.id).toLocaleString()}</td>
                            <td className="py-4 text-center">
                              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                                verified
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <button
                                onClick={() => handleToggleArtisanFeatured(
                                  artisan.id, artisan.featured
                                )}
                                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border transition-all ${
                                  artisan.featured
                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : 'bg-gray-100 text-gray-400 border-gray-200'
                                }`}
                              >
                                {artisan.featured ? '★ Featured' : 'Add to Home'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: All Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <h2 className="text-base font-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShoppingBag className="h-5 w-5 text-[#8B1A1A]" />
              Platform Products Catalog
            </h2>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold divide-y divide-gray-100">
                  <thead>
                    <tr className="text-gray-400 uppercase tracking-wider font-bold">
                      <th className="pb-3">Thumbnail</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Artisan</th>
                      <th className="pb-3 font-bold text-right">Price</th>
                      <th className="pb-3 text-center">Stock</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-center">Featured</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400 font-bold">
                          No products found in database.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;
                        return (
                          <tr key={product.id} className="text-gray-600">
                            <td className="py-4">
                              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-50 border shrink-0 flex items-center justify-center">
                                {mainImage ? (
                                  <Image src={mainImage} alt={product.title} fill className="object-cover" sizes="48px" />
                                ) : (
                                  <ShoppingBag className="h-5 w-5 text-[#8B1A1A]/20" />
                                )}
                              </div>
                            </td>
                            <td className="py-4">
                              <p className="font-extrabold text-[#1E1E1E] text-sm">{product.title}</p>
                              <p className="text-[10px] text-gray-400 capitalize font-bold mt-0.5">{product.craft_type}</p>
                            </td>
                            <td className="py-4 font-bold text-gray-700">{product.artisans?.display_name || 'Unknown Artisan'}</td>
                            <td className="py-4 text-right font-black text-[#D4890A]">LKR {product.price.toLocaleString()}</td>
                            <td className="py-4 text-center font-bold text-gray-700">{product.stock_quantity} pcs</td>
                            <td className="py-4 text-center">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                product.is_active
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-gray-100 text-gray-400 border border-gray-200'
                              }`}>
                                {product.is_active ? 'active' : 'hidden'}
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <button
                                onClick={() => handleToggleFeatured(product.id, product.featured)}
                                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border transition-all ${
                                  product.featured
                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : 'bg-gray-100 text-gray-400 border-gray-200'
                                }`}
                              >
                                {product.featured ? '★ Featured' : 'Not Featured'}
                              </button>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => handleToggleProductStatus(product.id, product.is_active)}
                                className={`p-2 rounded-xl transition-all border ${
                                  product.is_active
                                    ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-100'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100'
                                }`}
                                title={product.is_active ? 'Deactivate Product' : 'Activate Product'}
                              >
                                {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: All Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-base font-black flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="h-5 w-5 text-[#8B1A1A]" />
              Platform Transactions
            </h2>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold divide-y divide-gray-100">
                  <thead>
                    <tr className="text-gray-400 uppercase tracking-wider font-bold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Buyer Email</th>
                      <th className="pb-3">Date Placed</th>
                      <th className="pb-3 text-center">Items Count</th>
                      <th className="pb-3 text-right">Total Amount</th>
                      <th className="pb-3 text-center">Dispatch Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400 font-bold">
                          No order transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="text-gray-600">
                          <td className="py-4 font-mono font-black text-[#8B1A1A]">#{order.id.slice(0, 8)}</td>
                          <td className="py-4 font-bold text-gray-700">{order.profiles?.email || 'Guest / Buyer'}</td>
                          <td className="py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="py-4 text-center font-bold text-gray-700">{getOrderItemCount(order.id)} items</td>
                          <td className="py-4 text-right font-black text-[#D4890A]">LKR {order.total_amount.toLocaleString()}</td>
                          <td className="py-4 text-center">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled')}
                              className={`text-[10px] font-black uppercase tracking-wider rounded-xl px-2.5 py-1 border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] ${
                                order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                order.status === 'paid' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(status => (
                                <option key={status} value={status} className="capitalize text-gray-700 font-bold">
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
