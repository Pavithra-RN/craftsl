'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Artisan, Product } from '../../../types/database';
import { useAuth } from '@/providers/AuthProvider';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  LogOut, 
  DollarSign, 
  ClipboardList, 
  MapPin, 
  Loader2,
  X,
  Eye,
  EyeOff,
  User as UserIcon
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const supabase = createClient()

interface OrderItemWithDetails {
  id: string;
  order_id: string;
  product_id: string | null;
  artisan_id: string | null;
  quantity: number;
  unit_price: number;
  commission_rate: number;
  orders: {
    id: string;
    buyer_id: string | null;
    total_amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
  } | null;
  products: {
    id: string;
    title: string;
    images: string[];
    price: number;
  } | null;
}

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, profile } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'profile'>('overview');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  // Order items matching this artisan
  const [orderItems, setOrderItems] = useState<OrderItemWithDetails[]>([]);

  // Add/Edit Product Form Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productCraftType, setProductCraftType] = useState('batik');
  const [productStock, setProductStock] = useState<number>(10);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Profile Form state
  const [profileDisplayName, setProfileDisplayName] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileRegion, setProfileRegion] = useState('');
  const [profileCraftType, setProfileCraftType] = useState('batik');
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  useEffect(() => {
    console.log('Dashboard useEffect fired')
    
    const fetchDashboard = async () => {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const ANON_KEY = (typeof window !== 'undefined' && 
        (window as unknown as { __SUPABASE_ANON_KEY?: string }).__SUPABASE_ANON_KEY) || 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tY3hrZ2pidXNjcnJwdXh4Y3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTY5NDEsImV4cCI6MjA5NTczMjk0MX0.LugDTvtj0XIsTQMh9OSvT2VgT42R58lGG5bFXBm3veI'
      
      const raw = localStorage.getItem('craftsl-auth')
      if (!raw) { window.location.href = '/login'; return }
      
      const parsed = JSON.parse(raw)
      const userId = parsed?.user?.id
      const accessToken = parsed?.access_token
      
      console.log('userId:', userId, 'hasToken:', !!accessToken)
      
      if (!userId || !accessToken) {
        window.location.href = '/login'
        return
      }

      const headers = {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }

      // Fetch artisan
      const artisanRes = await fetch(
        `${SUPABASE_URL}/rest/v1/artisans?user_id=eq.${userId}&select=*`,
        { headers }
      )
      const artisanArr = await artisanRes.json()
      console.log('artisanArr:', artisanArr)
      
      const artisanData = Array.isArray(artisanArr) ? artisanArr[0] : null
      
      if (!artisanData) {
        window.location.href = '/'
        return
      }

      setArtisan(artisanData)
      setProfileDisplayName(artisanData.display_name)
      setProfileBio(artisanData.bio)
      setProfileRegion(artisanData.region)
      setProfileCraftType(artisanData.craft_type)
      setProfileAvatarUrl(artisanData.profile_image_url || '')

      // Fetch products
      const productsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?artisan_id=eq.${artisanData.id}&select=*&order=created_at.desc`,
        { headers }
      )
      const productsData = await productsRes.json()
      if (Array.isArray(productsData)) setProducts(productsData)

      // Fetch order items
      const itemsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/order_items?artisan_id=eq.${artisanData.id}&select=*,orders(*),products(*)`,
        { headers }
      )
      const itemsData = await itemsRes.json()
      if (Array.isArray(itemsData)) {
        setOrderItems(itemsData as unknown as OrderItemWithDetails[])
      }
    }

    fetchDashboard()
  }, [])



  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('craftsl-auth');
      window.location.href = '/';
    }
  };

  const refreshProductsAndOrders = async () => {
    if (!artisan) return;
    const supabase = createClient();

    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('artisan_id', artisan?.id)
      .order('created_at', { ascending: false });

    if (productsData) {
      setProducts(productsData);
    }

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('*, orders(*), products(*)')
      .eq('artisan_id', artisan?.id);

    if (itemsData) {
      setOrderItems(itemsData as unknown as OrderItemWithDetails[]);
    }
  };

  // Image Upload handler helper
  const uploadImage = async (file: File, folder: string): Promise<string> => {
    if (!artisan) return '';
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${artisan?.id}/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.warn("Storage upload failed (bucket might be unconfigured):", uploadError.message);
      // Fallback: throw to let caller choose fallback placeholder
      throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Handle Product Save (Add/Edit)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    setSavingProduct(true);

    try {
      const supabase = createClient();
      let imageUrl = productImageUrl;

      if (productImageFile) {
        try {
          imageUrl = await uploadImage(productImageFile, 'products');
        } catch {
          // Choose Unsplash fallback matching craft type if upload fails
          if (productCraftType === 'batik') {
            imageUrl = 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800';
          } else if (productCraftType === 'pottery') {
            imageUrl = 'https://images.unsplash.com/photo-1576016770956-debb63d900ef?auto=format&fit=crop&q=80&w=800';
          } else if (productCraftType === 'woodwork') {
            imageUrl = 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=800';
          } else if (productCraftType === 'gems') {
            imageUrl = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';
          } else if (productCraftType === 'weaving') {
            imageUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800';
          } else {
            imageUrl = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800';
          }
        }
      } else if (!imageUrl) {
        // Fallback placeholder if no file and no URL exists
        imageUrl = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800';
      }

      if (editingProduct) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update({
            title: productTitle,
            description: productDescription,
            price: productPrice,
            craft_type: productCraftType,
            stock_quantity: productStock,
            images: [imageUrl]
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Insert product
        const { error } = await supabase
          .from('products')
          .insert({
            artisan_id: artisan?.id,
            title: productTitle,
            description: productDescription,
            price: productPrice,
            craft_type: productCraftType,
            stock_quantity: productStock,
            images: [imageUrl],
            is_active: true
          });

        if (error) throw error;
      }

      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      await refreshProductsAndOrders();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product. Please try again.");
    } finally {
      setSavingProduct(false);
    }
  };

  const resetProductForm = () => {
    setProductTitle('');
    setProductDescription('');
    setProductPrice(0);
    setProductCraftType('batik');
    setProductStock(10);
    setProductImageFile(null);
    setProductImageUrl('');
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    resetProductForm();
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductTitle(product.title);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductCraftType(product.craft_type);
    setProductStock(product.stock_quantity);
    setProductImageUrl(product.images?.[0] || '');
    setProductImageFile(null);
    setShowProductModal(true);
  };

  // Toggle active status
  const toggleProductActive = async (product: Product) => {
    try {
      const supabase = createClient();
      const newStatus = !product.is_active;
      
      const { error } = await supabase
        .from('products')
        .update({ is_active: newStatus })
        .eq('id', product.id);

      if (error) throw error;
      
      // Update local state directly
      setProducts(products.map(p => p.id === product.id ? { ...p, is_active: newStatus } : p));
    } catch (err) {
      console.error("Error toggling product status:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  // Update profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    setSavingProfile(true);
    setProfileSaveSuccess(false);

    try {
      const supabase = createClient();
      let avatarUrl = profileAvatarUrl;

      if (profileAvatarFile) {
        try {
          avatarUrl = await uploadImage(profileAvatarFile, 'profile');
        } catch {
          // fallback placeholder avatar if upload fails
          avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
        }
      }

      const { error } = await supabase
        .from('artisans')
        .update({
          display_name: profileDisplayName,
          bio: profileBio,
          region: profileRegion,
          craft_type: profileCraftType as 'batik' | 'pottery' | 'woodwork' | 'gems' | 'weaving' | 'lacquerwork' | 'other',
          profile_image_url: avatarUrl
        })
        .eq('id', artisan?.id);

      if (error) throw error;

      // Update local state
      setArtisan({
        ...artisan,
        display_name: profileDisplayName,
        bio: profileBio,
        region: profileRegion,
        craft_type: profileCraftType as 'batik' | 'pottery' | 'woodwork' | 'gems' | 'weaving' | 'lacquerwork' | 'other',
        profile_image_url: avatarUrl
      });
      setProfileAvatarUrl(avatarUrl);
      setProfileSaveSuccess(true);
    } catch (err) {
      console.error("Error saving profile details:", err);
      alert("Failed to update profile settings.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Helper to generate shipping address based on buyer / order ID
  const getMockShippingAddress = (seedId: string) => {
    const addresses = [
      "12 Galle Road, Colombo 03",
      "45 Temple Road, Kandy",
      "88 Beach Road, Galle",
      "101 Flower Road, Jaffna",
      "32 Lake Drive, Nuwara Eliya",
      "15 Kurunegala Rd, Dambulla",
      "77 Sacred Road, Anuradhapura"
    ];
    let sum = 0;
    for (let i = 0; i < seedId.length; i++) {
      sum += seedId.charCodeAt(i);
    }
    return addresses[sum % addresses.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <Loader2 className="h-10 w-10 text-[#8B1A1A] animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading artisan dashboard...</p>
      </div>
    );
  }

  // Compute Stat Metrics
  const totalProducts = products.length;
  
  const uniqueOrderIds = Array.from(new Set(orderItems.map(item => item.order_id)));
  const totalOrders = uniqueOrderIds.length;

  const totalEarnings = orderItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  const pendingOrdersCount = Array.from(new Set(
    orderItems
      .filter(item => item.orders && item.orders.status === 'pending')
      .map(item => item.order_id)
  )).length;

  // Sorting order items for recent transactions display (Overview shows up to 5 items)
  const sortedOrderItemsForOverview = [...orderItems]
    .sort((a, b) => {
      const dateA = a.orders ? new Date(a.orders.created_at).getTime() : 0;
      const dateB = b.orders ? new Date(b.orders.created_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const sortedOrderItemsFull = [...orderItems]
    .sort((a, b) => {
      const dateA = a.orders ? new Date(a.orders.created_at).getTime() : 0;
      const dateB = b.orders ? new Date(b.orders.created_at).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {!artisan ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 text-sm">
            Loading your dashboard...
          </p>
        </div>
      ) : (
        <>
          {/* Verification Status Alert */}
          {artisan?.verification_status === 'pending' ? (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-800 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                <p className="font-bold text-sm">Account Pending Verification</p>
                <p className="mt-1 opacity-90">Your account is pending verification. You can add products but they will not be visible to buyers until your account is approved.</p>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-800 animate-fade-in">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                <p className="font-bold text-sm">Account Verified</p>
                <p className="mt-1 opacity-90">Your account is verified. Your products are live and available to global shoppers.</p>
              </div>
            </div>
          )}

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Sidebar Nav (Left) */}
            <aside className="md:col-span-1 space-y-2">
              
              {/* Artisan Avatar Profile Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm text-center flex flex-col items-center space-y-3">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#8B1A1A]/10 bg-gray-50 flex items-center justify-center">
                  {artisan?.profile_image_url ? (
                    <Image src={artisan?.profile_image_url} alt={artisan?.display_name} fill className="object-cover" sizes="64px" />
                  ) : (
                    <UserIcon className="h-8 w-8 text-[#8B1A1A]/30" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#1E1E1E]">{artisan?.display_name}</h3>
                  <p className="text-[10px] text-gray-400 capitalize font-bold mt-0.5">{artisan?.craft_type} Artisan</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm flex flex-col space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'products', label: 'My Products', icon: Package },
                  { id: 'orders', label: 'Orders', icon: ClipboardList },
                  { id: 'profile', label: 'Profile Settings', icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'overview' | 'products' | 'orders' | 'profile')}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        isSelected 
                          ? 'bg-[#8B1A1A]/5 text-[#8B1A1A]' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-[#8B1A1A]'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all border-t border-gray-50 mt-2 pt-3"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </aside>

            {/* Content Panel (Right) */}
            <main className="md:col-span-3 space-y-6">
              
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <h1 className="text-2xl font-extrabold">Welcome back, <span className="text-[#8B1A1A]">{artisan?.display_name}</span></h1>
                    <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#D4890A]" />
                      Operating from: <strong className="text-gray-600">{artisan?.region}</strong>
                    </p>
                  </div>

                  {/* Statistics row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Products Listed', val: totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Orders Received', val: totalOrders, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
                      { label: 'Total Earnings', val: `LKR ${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Pending Orders', val: pendingOrdersCount, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' }
                    ].map((stat, idx) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
                          <div className={`p-2.5 rounded-2xl w-fit ${stat.bg} ${stat.color}`}>
                            <StatIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-lg font-black mt-1 text-[#1E1E1E]">{stat.val}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Orders table */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <h2 className="text-base font-bold flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-[#8B1A1A]" />
                        Recent Orders
                      </h2>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-[#8B1A1A] hover:underline"
                      >
                        View All Orders
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold divide-y divide-gray-100">
                        <thead>
                          <tr className="text-gray-400 uppercase tracking-wider font-bold">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Buyer</th>
                            <th className="pb-3">Product</th>
                            <th className="pb-3 text-right">Amount</th>
                            <th className="pb-3 text-center">Status</th>
                            <th className="pb-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {sortedOrderItemsForOverview.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-400 font-bold">
                                No orders received yet. Once customers purchase your items, they will appear here.
                              </td>
                            </tr>
                          ) : (
                            sortedOrderItemsForOverview.map((item) => {
                              const order = item.orders;
                              const product = item.products;
                              if (!order) return null;
                              return (
                                <tr key={item.id} className="text-gray-600">
                                  <td className="py-4 font-mono text-[#8B1A1A] font-extrabold">#{order.id.slice(0, 8)}</td>
                                  <td className="py-4">Buyer #{order.id.slice(0, 4)}</td>
                                  <td className="py-4 font-bold text-[#1E1E1E] max-w-[150px] truncate">{product?.title || 'Heritage Craft'}</td>
                                  <td className="py-4 text-right font-black text-[#D4890A]">LKR {(item.unit_price * item.quantity).toLocaleString()}</td>
                                  <td className="py-4 text-center">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                      order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                      order.status === 'paid' ? 'bg-blue-50 text-blue-600' :
                                      order.status === 'shipped' ? 'bg-emerald-50 text-emerald-600' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
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

              {/* Tab 2: Products */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold">My Products</h1>
                    <button
                      onClick={openAddProductModal}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 text-white font-bold text-xs shadow hover:shadow-md transition-all active:scale-98 whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Product
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold divide-y divide-gray-100">
                        <thead>
                          <tr className="text-gray-400 uppercase tracking-wider font-bold">
                            <th className="pb-3">Thumbnail</th>
                            <th className="pb-3">Product Name</th>
                            <th className="pb-3">Price</th>
                            <th className="pb-3 text-center">Stock</th>
                            <th className="pb-3 text-center">Visibility</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {products.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-gray-400 font-bold">
                                You have not listed any products yet. Click &quot;Add New Product&quot; to list your crafts.
                              </td>
                            </tr>
                          ) : (
                            products.map((product) => {
                              const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;
                              return (
                                <tr key={product.id} className="text-gray-600">
                                  <td className="py-4">
                                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                                      {mainImage ? (
                                        <Image src={mainImage} alt={product.title} fill className="object-cover" sizes="48px" />
                                      ) : (
                                        <div className="absolute inset-0 bg-[#8B1A1A]/5 flex items-center justify-center">
                                          <ShoppingBag className="h-5 w-5 text-[#8B1A1A]/20" />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-4">
                                    <p className="font-extrabold text-[#1E1E1E] text-sm">{product.title}</p>
                                    <p className="text-[10px] text-gray-400 capitalize font-bold mt-0.5">{product.craft_type}</p>
                                  </td>
                                  <td className="py-4 font-black text-[#D4890A]">LKR {product.price.toLocaleString()}</td>
                                  <td className="py-4 text-center font-bold">{product.stock_quantity} pcs</td>
                                  <td className="py-4 text-center">
                                    <button
                                      onClick={() => toggleProductActive(product)}
                                      className="inline-flex items-center justify-center p-1 rounded-lg hover:bg-gray-50 transition-colors"
                                      title={product.is_active ? "Click to set Inactive" : "Click to set Active"}
                                    >
                                      {product.is_active ? (
                                        <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                          <Eye className="h-4 w-4" />
                                          Active
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-gray-400 font-bold">
                                          <EyeOff className="h-4 w-4" />
                                          Hidden
                                        </span>
                                      )}
                                    </button>
                                  </td>
                                  <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => openEditProductModal(product)}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-all"
                                        title="Edit Product"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                        title="Delete Product"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
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

              {/* Tab 3: Orders */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  <h1 className="text-2xl font-extrabold">Received Orders</h1>

                  {/* Orders List Table */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold divide-y divide-gray-100">
                        <thead>
                          <tr className="text-gray-400 uppercase tracking-wider font-bold">
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Product Name</th>
                            <th className="pb-3 text-center">Qty</th>
                            <th className="pb-3 text-right">Amount</th>
                            <th className="pb-3">Shipping Location</th>
                            <th className="pb-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {sortedOrderItemsFull.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-gray-400 font-bold">
                                No orders found containing your products.
                              </td>
                            </tr>
                          ) : (
                            sortedOrderItemsFull.map((item) => {
                              const order = item.orders;
                              const product = item.products;
                              if (!order) return null;
                              return (
                                <tr key={item.id} className="text-gray-600">
                                  <td className="py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                                  <td className="py-4 font-bold text-[#1E1E1E]">{product?.title || 'Heritage Craft'}</td>
                                  <td className="py-4 text-center font-bold">{item.quantity}</td>
                                  <td className="py-4 text-right font-black text-[#D4890A]">LKR {(item.unit_price * item.quantity).toLocaleString()}</td>
                                  <td className="py-4 text-gray-500 max-w-[200px] truncate" title={getMockShippingAddress(order.id)}>
                                    {getMockShippingAddress(order.id)}
                                  </td>
                                  <td className="py-4 text-center">
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                      order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                      order.status === 'paid' ? 'bg-blue-50 text-blue-600' :
                                      order.status === 'shipped' ? 'bg-emerald-50 text-emerald-600' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {order.status}
                                    </span>
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

              {/* Tab 4: Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  
                  <h1 className="text-2xl font-extrabold">Profile Settings</h1>

                  {/* Profile Details Edit Card */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                    
                    {profileSaveSuccess && (
                      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-800">
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold">Artisan profile updated successfully!</p>
                      </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      
                      {/* Photo upload */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-gray-50">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border bg-gray-50 flex items-center justify-center shrink-0">
                          {profileAvatarUrl ? (
                            <Image src={profileAvatarUrl} alt="Avatar Preview" fill className="object-cover" sizes="80px" />
                          ) : (
                            <UserIcon className="h-10 w-10 text-[#8B1A1A]/30" />
                          )}
                        </div>
                        <div className="space-y-2 text-center sm:text-left">
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">Artisan Display Photo</label>
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-98 transition-all">
                              <Upload className="h-3.5 w-3.5" />
                              <span>Choose New Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setProfileAvatarFile(file);
                                    setProfileAvatarUrl(URL.createObjectURL(file));
                                  }
                                }}
                              />
                            </label>
                            {profileAvatarFile && (
                              <span className="text-[10px] text-gray-400 font-bold truncate max-w-[150px]">
                                {profileAvatarFile.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Text Details Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Display Name</label>
                          <input
                            type="text"
                            required
                            value={profileDisplayName}
                            onChange={(e) => setProfileDisplayName(e.target.value)}
                            placeholder="Traditional Wood Carvers"
                            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Operating Region / District</label>
                          <input
                            type="text"
                            required
                            value={profileRegion}
                            onChange={(e) => setProfileRegion(e.target.value)}
                            placeholder="Ambalangoda"
                            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Main Craft Discipline</label>
                          <select
                            value={profileCraftType}
                            onChange={(e) => setProfileCraftType(e.target.value)}
                            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] capitalize"
                          >
                            {['batik', 'pottery', 'woodwork', 'gems', 'weaving', 'lacquerwork', 'other'].map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Bio / Workshop History</label>
                          <textarea
                            required
                            rows={4}
                            value={profileBio}
                            onChange={(e) => setProfileBio(e.target.value)}
                            placeholder="Briefly describe your workshop heritage, verified materials, and shipping capabilities..."
                            className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] resize-none"
                          />
                        </div>
                      </div>

                      {/* Save Button */}
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 text-white font-bold text-xs py-3.5 px-8 shadow hover:shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving Profile Changes...
                          </>
                        ) : (
                          'Save Settings'
                        )}
                      </button>

                    </form>

                  </div>

                </div>
              )}

            </main>
          </div>

          {/* Add / Edit Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <h3 className="text-lg font-bold text-[#1E1E1E]">
                    {editingProduct ? 'Edit Product Details' : 'Add New Craft Listing'}
                  </h3>
                  <button 
                    onClick={() => setShowProductModal(false)}
                    className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  
                  {/* Product details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product Title</label>
                      <input
                        type="text"
                        required
                        value={productTitle}
                        onChange={(e) => setProductTitle(e.target.value)}
                        placeholder="Handmade Sanni Wood Mask"
                        className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Price (LKR)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={productPrice}
                        onChange={(e) => setProductPrice(Number(e.target.value))}
                        placeholder="12500"
                        className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Stock Quantity</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={productStock}
                        onChange={(e) => setProductStock(Number(e.target.value))}
                        placeholder="5"
                        className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Craft Category</label>
                      <select
                        value={productCraftType}
                        onChange={(e) => setProductCraftType(e.target.value)}
                        className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] capitalize"
                      >
                        {['batik', 'pottery', 'woodwork', 'gems', 'weaving', 'lacquerwork', 'other'].map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product Image File</label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-98 transition-all">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Choose Image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setProductImageFile(file);
                              }
                            }}
                          />
                        </label>
                        <span className="text-[10px] text-gray-400 font-bold truncate max-w-[200px]">
                          {productImageFile ? productImageFile.name : (productImageUrl ? 'Keep current image' : 'No image chosen')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product Description</label>
                      <textarea
                        required
                        rows={3}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Provide details about sizing, paint finishes, materials used, etc..."
                        className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                    <button
                      type="button"
                      onClick={() => setShowProductModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-98 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProduct}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 text-white font-bold text-xs shadow active:scale-98 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {savingProduct ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Listing'
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
