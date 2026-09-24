"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { uploadImage } from "@/lib/upload";
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const empty: any = { name: "", slug: "", code: "", category_id: "", subcategory: "", price: "", promo_price: "", stock: "0", stock_status: "tersedia", badge: "", description: "", material: "", size: "", color: "", weight: "", rating: "0", review_count: "0", is_featured: false, is_active: true, main_image: "" };
const rp = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");
export default function Produk() {
  const sb = supabase();
  const [items, setItems] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [f, setF] = useState<any | null>(null);
  const [gal, setGal] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [main, setMain] = useState<File | null>(null);
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [ld, setLd] = useState(true);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = async () => {
    const [a, b] = await Promise.all([sb.from("products").select("*").order("created_at", { ascending: false }), sb.from("categories").select("id,name").order("sort_order")]);
    setItems(a.data || []); setCats(b.data || []); setLd(false);
  };
  useEffect(() => { load(); }, []);
  const open = async (p: any | null) => {
    setMain(null); setFiles([]); setGal([]);
    setF(p ? { ...empty, ...p } : { ...empty });
    if (p) { const { data } = await sb.from("product_images").select("*").eq("product_id", p.id).order("sort_order"); setGal(data || []); }
  };
  const save = async () => {
    if (!f.name || !f.price) { say("Nama dan harga wajib diisi."); return; }
    setBusy(true);
    try {
      let img = f.main_image || null;
      if (main) img = await uploadImage(main, "produk");
      const num = (x: any) => (x === "" || x == null ? null : Number(x));
      const row = { name: f.name, slug: f.slug || slugify(f.name), code: f.code || null, category_id: f.category_id || null, subcategory: f.subcategory || null, price: Number(f.price), promo_price: num(f.promo_price), stock: Number(f.stock) || 0, stock_status: f.stock_status, badge: f.badge || null, description: f.description || null, material: f.material || null, size: f.size || null, color: f.color || null, weight: f.weight || null, rating: Number(f.rating) || 0, review_count: Number(f.review_count) || 0, is_featured: !!f.is_featured, is_active: !!f.is_active, main_image: img };
      let id = f.id;
      if (id) { const r = await sb.from("products").update(row).eq("id", id); if (r.error) throw r.error; }
      else { const r = await sb.from("products").insert(row).select("id").single(); if (r.error) throw r.error; id = r.data.id; }
      for (const file of files) { const url = await uploadImage(file, "produk"); await sb.from("product_images").insert({ product_id: id, url }); }
      say(f.id ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.");
      setF(null); load();
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const toggle = async (p: any) => { await sb.from("products").update({ is_active: !p.is_active }).eq("id", p.id); say(p.is_active ? "Produk dinonaktifkan." : "Produk diaktifkan."); load(); };
  const del = async (p: any) => { if (!confirm(`Hapus "${p.name}"? Tindakan ini tidak bisa dibatalkan.`)) return; await sb.from("products").delete().eq("id", p.id); say("Produk berhasil dihapus."); load(); };
  const dup = async (p: any) => {
    const { id, created_at, ...rest } = p;
    const r = await sb.from("products").insert({ ...rest, name: p.name + " (Salin)", slug: p.slug + "-salin-" + Math.random().toString(36).slice(2, 5), code: null, is_active: false });
    say(r.error ? "Gagal menduplikasi." : "Produk berhasil diduplikasi (nonaktif)."); load();
  };
  const delImg = async (g: any) => { await sb.from("product_images").delete().eq("id", g.id); setGal(gal.filter((x) => x.id !== g.id)); };
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  const inp = (k: string, label: string, type = "text") => (<label className="block text-xs text-silver">{label}<input type={type} value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={cls + " mt-1"} /></label>);
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-lgold">Produk</h1><button onClick={() => open(null)} className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded">+ TAMBAH</button></div>
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-gold text-ink text-sm font-medium px-4 py-2 rounded shadow">{toast}</div>}
      {ld ? <p className="text-silver mt-6">Memuat…</p> : items.length === 0 ? <p className="text-silver mt-6">Belum ada produk.</p> : (
        <div className="mt-5 space-y-3">
          {items.map((p) => (
            <div key={p.id} className="bg-charcoal border border-gold/30 rounded-xl p-3 flex gap-3">
              <div className="w-16 h-16 bg-ink rounded overflow-hidden shrink-0">{p.main_image && <img src={p.main_image} alt="" className="w-full h-full object-cover" />}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name} {!p.is_active && <span className="text-xs text-silver">(nonaktif)</span>}</p>
                <p className="text-xs text-lgold">{rp(p.promo_price || p.price)} · stok {p.stock}</p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <button onClick={() => open(p)} className="border border-gold/50 text-gold rounded px-2 py-1">Edit</button>
                  <button onClick={() => toggle(p)} className="border border-silver/40 rounded px-2 py-1">{p.is_active ? "Nonaktifkan" : "Aktifkan"}</button>
                  <button onClick={() => dup(p)} className="border border-silver/40 rounded px-2 py-1">Duplikasi</button>
                  <button onClick={() => del(p)} className="border border-red-400/60 text-red-400 rounded px-2 py-1">Hapus</button>
                </div></div></div>))}
        </div>)}
      {f && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center"><h2 className="font-serif text-xl text-lgold">{f.id ? "Edit Produk" : "Tambah Produk"}</h2><button onClick={() => setF(null)} className="text-silver text-2xl">×</button></div>
            {inp("name", "Nama Produk")}
            {inp("slug", "Slug (kosongkan agar otomatis)")}
            <div className="grid grid-cols-2 gap-3">{inp("code", "Kode Produk")}{inp("subcategory", "Subkategori")}</div>
            <label className="block text-xs text-silver">Kategori<select value={f.category_id ?? ""} onChange={(e) => setF({ ...f, category_id: e.target.value })} className={cls + " mt-1"}><option value="">— pilih —</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <div className="grid grid-cols-2 gap-3">{inp("price", "Harga", "number")}{inp("promo_price", "Harga Promo", "number")}{inp("stock", "Stok", "number")}
              <label className="block text-xs text-silver">Status Stok<select value={f.stock_status} onChange={(e) => setF({ ...f, stock_status: e.target.value })} className={cls + " mt-1"}><option value="tersedia">Tersedia</option><option value="habis">Habis</option><option value="pre-order">Pre-order</option></select></label></div>
            <label className="block text-xs text-silver">Badge<select value={f.badge ?? ""} onChange={(e) => setF({ ...f, badge: e.target.value })} className={cls + " mt-1"}><option value="">Tanpa badge</option><option>BEST SELLER</option><option>PROMO</option><option>NEW</option><option>CUSTOM</option></select></label>
            <label className="block text-xs text-silver">Deskripsi<textarea rows={3} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} className={cls + " mt-1"} /></label>
            <div className="grid grid-cols-2 gap-3">{inp("material", "Material")}{inp("size", "Ukuran")}{inp("color", "Warna")}{inp("weight", "Berat")}{inp("rating", "Rating", "number")}{inp("review_count", "Jumlah Review", "number")}</div>
            <div className="flex gap-5 text-sm"><label><input type="checkbox" checked={!!f.is_featured} onChange={(e) => setF({ ...f, is_featured: e.target.checked })} /> Unggulan</label><label><input type="checkbox" checked={!!f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Aktif</label></div>
            <div className="text-xs text-silver">Foto Utama
              {(main || f.main_image) && <img src={main ? URL.createObjectURL(main) : f.main_image} alt="" className="h-24 rounded my-2" />}
              <input type="file" accept="image/*" onChange={(e) => setMain(e.target.files?.[0] || null)} className="block mt-1" /></div>
            <div className="text-xs text-silver">Gallery Foto
              <div className="flex gap-2 flex-wrap my-2">{gal.map((g) => <div key={g.id} className="relative"><img src={g.url} alt="" className="h-16 w-16 object-cover rounded" /><button onClick={() => delImg(g)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button></div>)}</div>
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="block mt-1" />
              {files.length > 0 && <p className="mt-1">{files.length} foto akan diunggah saat disimpan.</p>}</div>
            <button disabled={busy} onClick={save} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN"}</button>
          </div></div>)}
    </div>
  );
}
