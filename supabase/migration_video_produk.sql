-- Jalankan di Supabase > SQL Editor (khusus untuk project yang sudah pernah menjalankan schema.sql sebelumnya)
-- 1. Tambah kolom video_url ke tabel products
alter table products add column if not exists video_url text;

-- 2. Buat bucket storage baru khusus video (public, agar video bisa ditonton di website)
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- 3. Kebijakan akses bucket "videos": publik boleh membaca, hanya admin boleh upload/hapus
create policy "public read videos" on storage.objects for select using (bucket_id = 'videos');
create policy "admin write videos" on storage.objects for insert with check (bucket_id = 'videos' and is_admin());
create policy "admin update videos" on storage.objects for update using (bucket_id = 'videos' and is_admin());
create policy "admin delete videos" on storage.objects for delete using (bucket_id = 'videos' and is_admin());
