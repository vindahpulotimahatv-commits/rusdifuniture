"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { uploadImage } from "@/lib/upload";
import Toast from "@/components/admin/Toast";
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export default function Kategori() {
  const sb = supabase();
  const [items, setItems] = useState<any[]>([]);
  const [f, setF] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState(""); const [busy, setBusy] = useState(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = async () => { const { data } = await sb.from("categories").select("*").order("sort_order"); setItems(data || []); };
  useEffect(() => { load(); }, []);
  const open = (c: any | null) => { setFile(null); setF(c ? { ...c } : { name: "", slug: "", description: "", sort_order: (items.length + 1) * 10, is_active: true, image_url: "" }); };
  const save = async () => {
    if (!f.name) { say("Nama kategori wajib diisi."); return; }
    setBusy(true);
    try {
      let img = f.image_url || null; if (file) img = await uploadImage(file, "kategori");
      const row = { name: f.name, slug: f.slug || slugify(f.name), description: f.description || null, sort_order: Number(f.sort_order) || 0, is_active: !!f.is_active, image_url: img };
      const r = f.id ? await sb.from("categories").update(row).eq("id", f.id) : await sb.from("categories").insert(row);
      if (r.error) throw r.error;
      say(f.id ? "Kategori berhasil diperbarui." : "Kategori berhasil ditambahkan."); setF(null); load();
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const del = async (c: any) => { if (!confirm(`Hapus kategori "${c.name}"?`)) return; await sb.from("categories").delete().eq("id", c.id); say("Kategori berhasil dihapus."); load(); };
  const toggle = async (c: any) => { await sb.from("categories").update({ is_active: !c.is_active }).eq("id", c.id); load(); };
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-lgold">Kategori</h1><button onClick={() => open(null)} className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded">+ TAMBAH</button></div>
      <Toast msg={toast} />
      <div className="mt-5 space-y-2">
        {items.map((c) => (
          <div key={c.id} className="bg-charcoal border border-gold/30 rounded-xl p-3 flex gap-3 items-center">
            <div className="w-12 h-12 bg-ink rounded overflow-hidden shrink-0">{c.image_url && <img src={c.image_url} alt="" className="w-full h-full object-cover" />}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{c.name} {!c.is_active && <span className="text-xs text-silver">(nonaktif)</span>}</p>
              <div className="flex gap-2 mt-1 text-xs"><button onClick={() => open(c)} className="border border-gold/50 text-gold rounded px-2 py-1">Edit</button><button onClick={() => toggle(c)} className="border border-silver/40 rounded px-2 py-1">{c.is_active ? "Nonaktifkan" : "Aktifkan"}</button><button onClick={() => del(c)} className="border border-red-400/60 text-red-400 rounded px-2 py-1">Hapus</button></div></div></div>))}
      </div>
      {f && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"><div className="max-w-lg mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
          <div className="flex justify-between"><h2 className="font-serif text-xl text-lgold">{f.id ? "Edit" : "Tambah"} Kategori</h2><button onClick={() => setF(null)} className="text-silver text-2xl">×</button></div>
          <label className="block text-xs text-silver">Nama<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="block text-xs text-silver">Slug<input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="block text-xs text-silver">Deskripsi<textarea value={f.description || ""} onChange={(e) => setF({ ...f, description: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="block text-xs text-silver">Urutan<input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Aktif</label>
          <div className="text-xs text-silver">Foto{(file || f.image_url) && <img src={file ? URL.createObjectURL(file) : f.image_url} alt="" className="h-20 rounded my-2" />}<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block mt-1" /></div>
          <button disabled={busy} onClick={save} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN"}</button>
        </div></div>)}
    </div>
  );
}
