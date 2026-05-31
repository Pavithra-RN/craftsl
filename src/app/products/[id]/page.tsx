import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProductDetailInteractive from '@/components/ProductDetailInteractive';
import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

// Predefined fallback mock data for testing/preview before items are seeded in DB
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PLACEHOLDERS: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Maha Kola Sanni Wood Mask',
    price: 18500,
    craft_type: 'woodwork',
    description: 'A traditional Sri Lankan hand-carved mask representing the Maha Kola Sanni demon, historically used in traditional exorcism rituals (Tovil) and dances to ward off sickness. Hand-carved from light Balsa wood (Kaduru) and painted with natural pigments. This masterpiece features intricate details and vibrant expressions representing historical island folklore.',
    images: [
      'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    ],
    stock_quantity: 5,
    is_active: true,
    artisans: {
      id: 'artisan_1',
      display_name: 'Galle Mask Artisans',
      bio: 'A family guild of woodcarvers passing down traditional mask sculpting techniques for over four generations in Ambalangoda, Southern Sri Lanka.',
      craft_type: 'woodwork',
      region: 'Ambalangoda',
      verified: true,
      profile_image_url: null
    }
  },
  '2': {
    id: '2',
    title: 'Traditional Silk Batik Sarong',
    price: 9500,
    craft_type: 'batik',
    description: 'Exquisite hand-dyed pure silk batik sarong featuring traditional floral patterns. Every piece is individually hand-waxed and dyed by local artisans in Matara, making each design completely unique. Features a soft premium feel and vibrant crimson dyes.',
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1567401893930-79072f3531a4?auto=format&fit=crop&q=80&w=800',
    ],
    stock_quantity: 12,
    is_active: true,
    artisans: {
      id: 'artisan_2',
      display_name: 'Kanthi Batik Handloom',
      bio: 'Master batik craftswoman Kanthi Perera runs a cooperative empowering over 15 rural women artisans in Matara, keeping the wax-resist dyeing traditions alive.',
      craft_type: 'batik',
      region: 'Matara',
      verified: true,
      profile_image_url: null
    }
  },
  '3': {
    id: '3',
    title: 'Earthen Clay Terracotta Pot',
    price: 3200,
    craft_type: 'pottery',
    description: 'Traditional Sri Lankan clay pot (Kalaya) handmade using local clay deposits. Clay cookware is celebrated for its ability to retain nutrients and add a distinct earthy aroma to local curries. Kiln-fired to perfection for daily cooking use or home decoration.',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&q=80&w=800',
    ],
    stock_quantity: 20,
    is_active: true,
    artisans: {
      id: 'artisan_3',
      display_name: 'Alwis Earthen Pots',
      bio: 'Dharmadasa Alwis operates his family pottery wheel in the clay-rich fields of Kegalle, creating functional earthenware using ancestral clay-firing methods.',
      craft_type: 'pottery',
      region: 'Kegalle',
      verified: true,
      profile_image_url: null
    }
  },
  '4': {
    id: '4',
    title: 'Hand-Polished Brass Oil Lamp',
    price: 14200,
    craft_type: 'other',
    description: 'Crafted using the ancient lost-wax casting technique, this traditional brass oil lamp is lit at auspicious moments, signifying light, wisdom, and new beginnings. Hand-polished to a radiant golden finish.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
    ],
    stock_quantity: 3,
    is_active: true,
    artisans: {
      id: 'artisan_4',
      display_name: 'Pilimatalawa Brass Guild',
      bio: 'Gathering local metalworkers in Pilimatalawa near Kandy, this guild specializes in hand-beaten brass and traditional bronze oil lamps.',
      craft_type: 'other',
      region: 'Pilimatalawa',
      verified: true,
      profile_image_url: null
    }
  }
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  let title = "Authentic Product | CraftSL";
  let description = "Discover unique authentic hand-made Sri Lankan crafts on CraftSL.";

  if (PLACEHOLDERS[id]) {
    title = `${PLACEHOLDERS[id].title} | CraftSL`;
    description = PLACEHOLDERS[id].description;
  } else {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('title, description')
        .eq('id', id)
        .single();
      
      if (data) {
        title = `${data.title} | CraftSL`;
        description = data.description || description;
      }
    } catch {
      // ignore postgres syntax/missing ID errors in metadata resolver
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let product: any = null;

  if (PLACEHOLDERS[id]) {
    product = PLACEHOLDERS[id];
  } else {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, artisans(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        product = data;
      }
    } catch (err) {
      console.error("Error query product details:", err);
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#1E1E1E]">
      <ProductDetailInteractive initialProduct={product} />
    </div>
  );
}
