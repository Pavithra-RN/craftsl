-- Create craft_type enum check and status checks directly in constraints
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  role text not null default 'buyer' check (role in ('buyer', 'artisan', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Helper function to check if user is admin safely (avoiding RLS recursion)
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Helper function to get user role safely (avoiding RLS recursion)
create or replace function public.get_user_role(user_id uuid)
returns text as $$
begin
  return (
    select role from public.profiles
    where id = user_id
  );
end;
$$ language plpgsql security definer;

-- 2. ARTISANS TABLE
create table public.artisans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  display_name text not null,
  bio text not null,
  craft_type text not null check (craft_type in ('batik', 'pottery', 'woodwork', 'gems', 'weaving', 'lacquerwork', 'other')),
  region text not null,
  verified boolean not null default false,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  profile_image_url text,
  created_at timestamptz not null default now(),
  constraint unique_artisan_user unique (user_id)
);

-- 3. PRODUCTS TABLE
create table public.products (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid references public.artisans(id) on delete cascade not null,
  title text not null,
  description text not null,
  price numeric not null check (price >= 0),
  currency text not null default 'LKR',
  craft_type text not null,
  images text[] not null default '{}'::text[],
  stock_quantity integer not null default 1 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. ORDERS TABLE
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references public.profiles(id) on delete set null,
  total_amount numeric not null check (total_amount >= 0),
  currency text not null default 'LKR',
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

-- 5. ORDER_ITEMS TABLE
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  artisan_id uuid references public.artisans(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0),
  commission_rate numeric not null default 0.15 check (commission_rate >= 0 and commission_rate <= 1)
);

-- ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.artisans enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- =========================================================================
-- RLS POLICIES
-- =========================================================================

-- --- PROFILES POLICIES ---
create policy "Allow public read access to profiles" 
  on public.profiles for select 
  using (true);

create policy "Allow users or admins to update their profiles" 
  on public.profiles for update 
  using (auth.uid() = id or public.is_admin(auth.uid()));

-- --- ARTISANS POLICIES ---
create policy "Allow public read access to artisans" 
  on public.artisans for select 
  using (true);

create policy "Allow insert for artisans themselves" 
  on public.artisans for insert 
  with check (auth.uid() = user_id and (public.get_user_role(auth.uid()) = 'artisan' or public.is_admin(auth.uid())));

create policy "Allow update/delete for owner artisan or admin" 
  on public.artisans for update 
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Allow delete for owner artisan or admin" 
  on public.artisans for delete 
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- --- PRODUCTS POLICIES ---
create policy "Allow public read access to active products" 
  on public.products for select 
  using (is_active = true or exists (
    select 1 from public.artisans where id = artisan_id and user_id = auth.uid()
  ) or public.is_admin(auth.uid()));

create policy "Allow insert for registered artisan owners or admins" 
  on public.products for insert 
  with check (
    exists (select 1 from public.artisans where id = artisan_id and user_id = auth.uid()) 
    and (public.get_user_role(auth.uid()) = 'artisan' or public.is_admin(auth.uid()))
  );

create policy "Allow update for artisan owners or admins" 
  on public.products for update 
  using (
    exists (select 1 from public.artisans where id = artisan_id and user_id = auth.uid()) 
    or public.is_admin(auth.uid())
  );

create policy "Allow delete for artisan owners or admins" 
  on public.products for delete 
  using (
    exists (select 1 from public.artisans where id = artisan_id and user_id = auth.uid()) 
    or public.is_admin(auth.uid())
  );

-- --- ORDERS POLICIES ---
create policy "Allow buyers, artisans of items, or admins to read orders" 
  on public.orders for select 
  using (
    buyer_id = auth.uid() 
    or public.is_admin(auth.uid())
    or exists (
      select 1 from public.order_items oi
      join public.artisans a on oi.artisan_id = a.id
      where oi.order_id = orders.id and a.user_id = auth.uid()
    )
  );

create policy "Allow buyers or admins to insert orders" 
  on public.orders for insert 
  with check (buyer_id = auth.uid() or public.is_admin(auth.uid()));

create policy "Allow admins to update orders" 
  on public.orders for update 
  using (public.is_admin(auth.uid()));

create policy "Allow admins to delete orders" 
  on public.orders for delete 
  using (public.is_admin(auth.uid()));

-- --- ORDER ITEMS POLICIES ---
create policy "Allow buyers, artisans of the item, or admins to read order items" 
  on public.order_items for select 
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
    or exists (select 1 from public.artisans a where a.id = artisan_id and a.user_id = auth.uid())
    or public.is_admin(auth.uid())
  );

create policy "Allow buyers or admins to insert order items" 
  on public.order_items for insert 
  with check (
    exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid())
    or public.is_admin(auth.uid())
  );

create policy "Allow admins to update order items" 
  on public.order_items for update 
  using (public.is_admin(auth.uid()));

create policy "Allow admins to delete order items" 
  on public.order_items for delete 
  using (public.is_admin(auth.uid()));

-- =========================================================================
-- AUTH TRIGGER FOR PROFILES
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'buyer'),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- STORAGE BUCKET CONFIGURATION
-- =========================================================================

-- Create 'product-images' bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Enable storage policies (on storage.objects)
create policy "Allow public read access to product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Allow authenticated artisans or admins to upload product-images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and (
      public.get_user_role(auth.uid()) = 'artisan'
      or public.is_admin(auth.uid())
    )
  );

create policy "Allow owners or admins to delete product-images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and (auth.uid() = owner or public.is_admin(auth.uid()))
  );

create policy "Allow owners or admins to update product-images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and (auth.uid() = owner or public.is_admin(auth.uid()))
  );
