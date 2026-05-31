'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartProvider';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { 
  ShieldCheck, 
  ShoppingBag, 
  ChevronLeft, 
  CreditCard, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_key_here'
);

function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { cart, subtotal, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(true);
  const supabase = createClient();

  // Buyer Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  const [postalCode, setPostalCode] = useState('');

  // UI Flow State
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('Checkout auth check:', user?.email, error)
      
      if (user) {
        setUser(user)
        setEmail(user.email || '')
        setFullName(user.user_metadata?.full_name || '')
        setAuthChecked(true)
        return
      }
      
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Checkout session fallback:', session?.user?.email)
      
      if (session?.user) {
        setUser(session.user)
        setEmail(session.user.email || '')
        setFullName(session.user.user_metadata?.full_name || '')
        setAuthChecked(true)
        return
      }
      
      router.push('/login?redirectTo=/checkout')
    }
    
    checkAuth()
  }, [])

  // Set default email from profile if available
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
    }
  }, [user]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMsg('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    setErrorMsg(null);
    setProcessing(true);

    try {
      // Simulate Stripe processing card latency
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let currentUser = user
      if (!currentUser) {
        const supabase = createClient()
        const { data: { user: freshUser } } = await supabase.auth.getUser()
        if (!freshUser) {
          throw new Error('You must be logged in to complete payment.')
        }
        currentUser = freshUser
      }

      // 1. Create order record in Supabase orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: currentUser.id,
          total_amount: subtotal,
          currency: 'LKR',
          status: 'paid', // Automatically complete paid status for mock transaction
          stripe_payment_intent_id: 'pi_mock_' + Math.random().toString(36).substring(2)
        })
        .select()
        .single();

      console.log('Order created:', orderData, orderError)

      if (orderError) {
        throw new Error('Supabase order creation failed: ' + orderError.message);
      }

      const orderId = orderData.id;

      // 2. Prepare items mapping
      console.log('Cart items:', JSON.stringify(cart))
      const orderItemsInsert = cart.map(item => ({
        order_id: orderId,
        product_id: item.id,
        artisan_id: item.artisanId || null,
        quantity: item.quantity,
        unit_price: item.price,
        commission_rate: 0.15
      }));

      // 3. Create records in Supabase order_items table
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsInsert);

      console.log('Order items result:', itemsError)

      if (itemsError) {
        throw new Error('Supabase order items mapping failed: ' + itemsError.message);
      }

      // 4. Complete flow: Clear Cart and Redirect
      clearCart();
      router.push(`/order-confirmation/${orderId}`);

    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'Payment validation error.');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: '#1E1E1E',
        fontFamily: 'Inter, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '14px',
        '::placeholder': {
          color: '#A0A0A0',
        },
      },
      invalid: {
        color: '#dc2626',
        iconColor: '#dc2626',
      },
    },
    hidePostalCode: true, // We already collect it in address details
  };

  if (!authChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8B1A1A]"></div>
        <p className="text-xs text-gray-500 font-semibold">Checking authentication credentials...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Form Details & Payment */}
      <form onSubmit={handlePay} className="lg:col-span-8 space-y-6">
        
        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Checkout Error</p>
              <p className="mt-1 opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* 1. Buyer Details Box */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-[#1E1E1E] pb-3 border-b border-gray-50 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#8B1A1A]" />
            Buyer & Shipping Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Pavithra Rangana"
                className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@craftsl.lk"
                className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Shipping Address (Line 1)</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="100 Galle Road, Colombo 03"
                className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Colombo"
                className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Sri Lanka"
                className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Postal / Zip Code</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="00300"
                className="w-full text-sm rounded-xl border border-gray-200 px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
              />
            </div>
          </div>
        </div>

        {/* 2. Payment Section */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-[#1E1E1E] pb-3 border-b border-gray-50 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#8B1A1A]" />
            Secure Card Payment
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 py-4.5">
              <CardElement options={cardElementOptions} />
            </div>

            {/* Test card prompt */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-semibold text-amber-800 leading-relaxed">
              <p className="font-bold flex items-center gap-1 mb-0.5">
                <AlertCircle className="h-4 w-4" />
                Prototype Sandbox Mode
              </p>
              <p>Use test card: <span className="font-mono bg-amber-100/50 px-1 py-0.5 rounded">4242 4242 4242 4242</span> with any future expiration date (e.g. 12/28) and any 3-digit CVC code.</p>
            </div>
          </div>
        </div>

        {/* Pay CTA */}
        <button
          type="submit"
          disabled={processing || cart.length === 0}
          className="w-full inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 text-white font-bold text-sm py-4.5 shadow-lg shadow-[#8B1A1A]/10 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>{processing ? 'Processing Secure Payment...' : `Authorize Payment (LKR ${subtotal.toLocaleString()})`}</span>
          {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
        </button>

      </form>

      {/* Right Column: Order summary sidebar */}
      <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-[#1E1E1E] pb-3 border-b border-gray-50">
          Order Items
        </h2>

        {/* mini list of items */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-3 items-center text-xs">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="absolute inset-0 bg-[#8B1A1A]/5 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-[#8B1A1A]/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-[#1E1E1E] truncate">{item.title}</p>
                <p className="text-[10px] text-gray-400">Qty: {item.quantity} • By {item.artisanName}</p>
              </div>
              <span className="font-black text-gray-700 whitespace-nowrap">
                LKR {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <hr className="border-gray-50" />

        {/* Pricing details */}
        <div className="space-y-3 text-xs font-semibold text-[#5A5A5A]">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="font-extrabold text-[#1E1E1E]">LKR {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span className="text-emerald-600 font-extrabold bg-emerald-50 px-2 rounded">Free</span>
          </div>
          <hr className="border-gray-50 pt-1" />
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-bold text-[#1E1E1E]">Total Due</span>
            <span className="font-black text-lg text-[#D4890A]">LKR {subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      <div className="mb-8 space-y-2">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#5A5A5A] hover:text-[#8B1A1A] transition-colors mb-2 group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Return to Cart
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Secure <span className="text-[#8B1A1A]">Checkout</span>
        </h1>
        <p className="text-sm text-[#5A5A5A]">
          Provide shipping credentials and authorize payment to initiate artisan workshop logistics.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[40vh] bg-white border border-gray-100 rounded-3xl p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#8B1A1A]"></div>
        </div>
      }>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </Suspense>
    </div>
  );
}
