export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'buyer' | 'artisan' | 'admin'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role?: 'buyer' | 'artisan' | 'admin'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'buyer' | 'artisan' | 'admin'
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedSource: "auth"
          }
        ]
      }
      artisans: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string
          craft_type: 'batik' | 'pottery' | 'woodwork' | 'gems' | 'weaving' | 'lacquerwork' | 'other'
          region: string
          verified: boolean
          verification_status: 'pending' | 'approved' | 'rejected'
          profile_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio: string
          craft_type: 'batik' | 'pottery' | 'woodwork' | 'gems' | 'weaving' | 'lacquerwork' | 'other'
          region: string
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          profile_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string
          craft_type?: 'batik' | 'pottery' | 'woodwork' | 'gems' | 'weaving' | 'lacquerwork' | 'other'
          region?: string
          verified?: boolean
          verification_status?: 'pending' | 'approved' | 'rejected'
          profile_image_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artisans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedSource: "public"
          }
        ]
      }
      products: {
        Row: {
          id: string
          artisan_id: string
          title: string
          description: string
          price: number
          currency: string
          craft_type: string
          images: string[]
          stock_quantity: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          artisan_id: string
          title: string
          description: string
          price: number
          currency?: string
          craft_type: string
          images?: string[]
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          artisan_id?: string
          title?: string
          description?: string
          price?: number
          currency?: string
          craft_type?: string
          images?: string[]
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedSource: "public"
          }
        ]
      }
      orders: {
        Row: {
          id: string
          buyer_id: string | null
          total_amount: number
          currency: string
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          stripe_payment_intent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id?: string | null
          total_amount: number
          currency?: string
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string | null
          total_amount?: number
          currency?: string
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedSource: "public"
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          artisan_id: string | null
          quantity: number
          unit_price: number
          commission_rate: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          artisan_id?: string | null
          quantity: number
          unit_price: number
          commission_rate?: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          artisan_id?: string | null
          quantity?: number
          unit_price?: number
          commission_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedSource: "public"
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedSource: "public"
          },
          {
            foreignKeyName: "order_items_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedSource: "public"
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier data consumption
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Artisan = Database['public']['Tables']['artisans']['Row']
export type ArtisanInsert = Database['public']['Tables']['artisans']['Insert']
export type ArtisanUpdate = Database['public']['Tables']['artisans']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']
