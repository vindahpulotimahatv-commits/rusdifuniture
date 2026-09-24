-- Jalankan di Supabase > SQL Editor
create table admins(user_id uuid primary key references auth.users on delete cascade);
create or replace function is_admin() returns boolean language sql security definer as $$ select exists(select 1 from admins where user_id=auth.uid()) $$;
create table categories(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,description text,image_url text,sort_order int default 0,is_active bool default true);
create table products(id uuid primary key default gen_random_uuid(),category_id uuid references categories on delete set null,subcategory text,name text not null,slug text unique not null,code text,price numeric not null,promo_price numeric,stock int default 0,stock_status text default 'tersedia',badge text,description text,material text,size text,color text,weight text,rating numeric default 0,review_count int default 0,is_featured bool default false,is_active bool default true,main_image text,created_at timestamptz default now());
create table product_images(id uuid primary key default gen_random_uuid(),product_id uuid references products on delete cascade,url text not null,sort_order int default 0);
create table banners(id uuid primary key default gen_random_uuid(),type text default 'hero',image_url text,title text,subtitle text,button_text text,button_url text,sort_order int default 0,is_active bool default true);
create table promos(id uuid primary key default gen_random_uuid(),name text not null,description text,banner_url text,starts_at date,ends_at date,discount_percent int,is_active bool default true);
create table promo_products(promo_id uuid references promos on delete cascade,product_id uuid references products on delete cascade,primary key(promo_id,product_id));
create table orders(id uuid primary key default gen_random_uuid(),order_no text unique not null,customer_name text,whatsapp text,address text,note text,total numeric,status text default 'BARU',created_at timestamptz default now());
create table order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders on delete cascade,product_id uuid references products on delete set null,product_name text,qty int,price numeric);
create table gallery(id uuid primary key default gen_random_uuid(),title text,category text,description text,image_url text,is_active bool default true);
create table testimonials(id uuid primary key default gen_random_uuid(),name text,photo_url text,rating int default 5,comment text,created_at date default current_date,is_active bool default true);
create table settings(key text primary key,value text);
insert into settings values('store_name','RUSDI FURNITURE'),('subtitle','CUSTOM BEKASI'),('tagline','Furniture Berkualitas untuk Rumah Impian Anda'),('whatsapp','6281291064259'),('copyright','© 2026 Rusdi Furniture. All Rights Reserved.');
-- Keamanan (RLS): publik hanya boleh baca, admin boleh semua
do $$ declare t text; begin
 foreach t in array array['categories','products','product_images','banners','promos','promo_products','gallery','testimonials','settings','orders','order_items','admins'] loop
  execute format('alter table %I enable row level security',t);
  execute format('create policy admin_all on %I for all using(is_admin()) with check(is_admin())',t);
  if t not in ('orders','order_items','admins') then execute format('create policy public_read on %I for select using(true)',t); end if;
 end loop; end $$;
create policy public_order on orders for insert with check(true);
create policy public_order_items on order_items for insert with check(true);
