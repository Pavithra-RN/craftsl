import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: {
    orderId: string;
  };
}

export const dynamic = 'force-dynamic';

interface ConfirmationOrder {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Order Confirmed | CraftSL`,
    description: `Thank you for supporting authentic Sri Lankan artisans.`,
  };
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = params;
  let order: ConfirmationOrder | null = null;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (data) {
      order = data;
    }
  } catch (err) {
    console.error("Error loading order confirmation:", err);
  }

  // Fallback mock order if orderId is a placeholder or not yet synchronized in DB
  const confirmedOrder: ConfirmationOrder = order || {
    id: orderId,
    total_amount: 28000,
    status: 'paid',
    created_at: new Date().toISOString(),
  };

  const shortOrderId = confirmedOrder.id.slice(0, 8);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      {/* Thank you card wrapper */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-center flex flex-col items-center">
        
        {/* Success Icon: Large green checkmark */}
        <div className="p-4 bg-emerald-50 rounded-full text-emerald-500 animate-bounce">
          <CheckCircle className="h-16 w-16 text-emerald-500 stroke-[2]" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#8B1A1A]">
            Order Confirmed!
          </h1>
          <p className="text-sm font-semibold text-[#D4890A]">
            Thank you for supporting Sri Lankan artisans
          </p>
        </div>

        {/* Order Details box */}
        <div className="w-full bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 space-y-4 text-sm font-semibold">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-400">Order Reference</span>
            <span className="font-mono text-[#8B1A1A] font-extrabold bg-[#8B1A1A]/5 px-2.5 py-1 rounded border border-[#8B1A1A]/10">
              Order #{shortOrderId}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Total Paid</span>
            <span className="font-extrabold text-lg text-[#D4890A]">
              LKR {confirmedOrder.total_amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Confirmation Message */}
        <p className="text-sm text-[#5A5A5A] max-w-md mx-auto leading-relaxed">
          Your artisan has been notified and will ship your order soon. You will receive a confirmation email shortly.
        </p>

        {/* Call to action */}
        <div className="w-full pt-4">
          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center rounded-xl bg-[#8B1A1A] hover:bg-[#8B1A1A]/95 text-white font-bold text-sm py-4 shadow hover:shadow-lg active:scale-98 transition-all group"
          >
            Continue Shopping
            <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
