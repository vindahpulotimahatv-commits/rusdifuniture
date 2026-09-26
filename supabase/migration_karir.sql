-- Jalankan di Supabase > SQL Editor untuk mengaktifkan fitur Karir (lowongan kerja & pelamar)

-- 1. Tabel lowongan kerja
create table if not exists job_openings(
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  department text,
  location text,
  employment_type text default 'Penuh Waktu',
  description text,
  requirements text,
  is_active bool default true,
  created_at timestamptz default now()
);

-- 2. Tabel pelamar (data lamaran yang masuk dari website)
create table if not exists job_applications(
  id uuid primary key default gen_random_uuid(),
  job_id uuid references job_openings on delete set null,
  job_title text,
  full_name text not null,
  email text,
  phone text,
  cover_letter text,
  cv_url text,
  status text default 'BARU',
  created_at timestamptz default now()
);

-- 3. Keamanan (RLS)
alter table job_openings enable row level security;
create policy admin_all on job_openings for all using(is_admin()) with check(is_admin());
create policy public_read on job_openings for select using(true);

alter table job_applications enable row level security;
create policy admin_all on job_applications for all using(is_admin()) with check(is_admin());
create policy public_apply on job_applications for insert with check(true);

-- 4. Bucket storage untuk file CV pelamar (public, agar admin bisa membuka link CV)
insert into storage.buckets (id, name, public)
values ('cv', 'cv', true)
on conflict (id) do nothing;

create policy "public read cv" on storage.objects for select using (bucket_id = 'cv');
create policy "public upload cv" on storage.objects for insert with check (bucket_id = 'cv');
create policy "admin delete cv" on storage.objects for delete using (bucket_id = 'cv' and is_admin());
