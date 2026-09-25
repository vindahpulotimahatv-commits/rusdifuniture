"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { uploadImage } from "@/lib/upload";
import Toast from "@/components/admin/Toast";
export default function Promo() {
  const sb = supabase();
  const [items, setItems] = useState<any[]>([]);
  const [prods, setProds] = useState<any[]>([]);
  const [f, setF] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [toast, setToast] = useState(""); const [busy, setBusy] = useState(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = async () => {
    const [a, b] = await Promise.all([sb.from("promos").select("*").order("id", { ascending: false }), sb.from("products").select("id,name")]);
    setItems(a.data || []); setProds(b.data || []);
  };
  useEffect(() => { load(); }, []);
  const open = async (p: any | null) => {
    setFile(null); setF(p ? { ...p } : { name: "", description: "", starts_at: "", ends_at: "", discount_percent: "", is_active: true, banner_url: "" });
    if (p) { const { data } = await sb.from("promo_products").select("product_id").eq("promo_id", p.id); setPicked((data || []).map((r: any) => r.product_id)); } else setPicked([]);
  };
  const save = async () => {
    if (!f.name) { say("Nama promo wajib diisi."); return; }
    setBusy(true);
    try {
      let img = f.banner_url || null; if (file) img = await uploadImage(file, "promo");
      const row = { name: f.name, description: f.description || null, starts_at: f.starts_at || null, ends_at: f.ends_at || null, discount_percent: f.discount_percent ? Number(f.discount_percent) : null, is_active: !!f.is_active, banner_url: img };
      let id = f.id;
      if (id) { const r = await sb.from("promos").update(row).eq("id", id); if (r.error) throw r.error; }
      else { const r = await sb.from("promos").insert(row).select("id").single(); if (r.error) throw r.error; id = r.data.id; }
      await sb.from("promo_products").delete().eq("promo_id", id);
      if (picked.length) await sb.from("promo_products").insert(picked.map((pid) => ({ promo_id: id, product_id: pid })));
      say("Promo berhasil disimpan."); setF(null); load();
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const del = async (p: any) => { if (!confirm(`Hapus promo "${p.name}"?`)) return; await sb.from("promos").delete().eq("id", p.id); say("Promo berhasil dihapus."); load(); };
  const toggle = async (p: any) => { await sb.from("promos").update({ is_active: !p.is_active }).eq("id", p.id); load(); };
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-lgold">Promo</h1><button onClick={() => open(null)} className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded">+ TAMBAH</button></div>
      <Toast msg={toast} />
      <div className="mt-5 space-y-2">
        {items.map((p) => (
          <div key={p.id} className="bg-charcoal border border-gold/30 rounded-xl p-3">
            <p className="text-sm font-medium">{p.name} {!p.is_active && <span className="text-xs text-silver">(nonaktif)</span>}</p>
            {p.discount_percent && <p className="text-xs text-lgold">Diskon {p.discount_percent}%</p>}
            <div className="flex gap-2 mt-1 text-xs"><button onClick={() => open(p)} className="border border-gold/50 text-gold rounded px-2 py-1">Edit</button><button onClick={() => toggle(p)} className="border border-silver/40 rounded px-2 py-1">{p.is_active ? "Nonaktifkan" : "Aktifkan"}</button><button onClick={() => del(p)} className="border border-red-400/60 text-red-400 rounded px-2 py-1">Hapus</button></div></div>))}
      </div>
      {f && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"><div className="max-w-lg mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
          <div className="flex justify-between"><h2 className="font-serif text-xl text-lgold">Promo</h2><button onClick={() => setF(null)} className="text-silver text-2xl">×</button></div>
          <label className="block text-xs text-silver">Nama Promo<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="block text-xs text-silver">Deskripsi<textarea value={f.description || ""} onChange={(e) => setF({ ...f, description: e.target.value })} className={cls + " mt-1"} /></label>
          <div className="grid grid-cols-2 gap-3"><label className="block text-xs text-silver">Mulai<input type="date" value={f.starts_at || ""} onChange={(e) => setF({ ...f, starts_at: e.target.value })} className={cls + " mt-1"} /></label>
            <label className="block text-xs text-silver">Selesai<input type="date" value={f.ends_at || ""} onChange={(e) => setF({ ...f, ends_at: e.target.value })} className={cls + " mt-1"} /></label></div>
          <label className="block text-xs text-silver">Diskon (%)<input type="number" value={f.discount_percent || ""} onChange={(e) => setF({ ...f, discount_percent: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Aktif</label>
          <div className="text-xs text-silver">Banner{(file || f.banner_url) && <img src={file ? URL.createObjectURL(file) : f.banner_url} alt="" className="h-20 rounded my-2" />}<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block mt-1" /></div>
          <div className="text-xs text-silver">Produk Promo<div className="max-h-40 overflow-y-auto mt-1 border border-gold/20 rounded p-2 space-y-1">
            {prods.map((p) => <label key={p.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={picked.includes(p.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, p.id] : picked.filter((x) => x !== p.id))} /> {p.name}</label>)}
          </div></div>
          <button disabled={busy} onClick={save} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN"}</button>
        </div></div>)}
    </div>
  );
}
