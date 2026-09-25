"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { uploadImage } from "@/lib/upload";
import Toast from "@/components/admin/Toast";
export default function Galeri() {
  const sb = supabase();
  const [items, setItems] = useState<any[]>([]);
  const [f, setF] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState(""); const [busy, setBusy] = useState(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = async () => { const { data } = await sb.from("gallery").select("*").order("id", { ascending: false }); setItems(data || []); };
  useEffect(() => { load(); }, []);
  const open = (g: any | null) => { setFile(null); setF(g ? { ...g } : { title: "", category: "", description: "", is_active: true, image_url: "" }); };
  const save = async () => {
    if (!file && !f.image_url) { say("Pilih foto terlebih dahulu."); return; }
    setBusy(true);
    try {
      let img = f.image_url || null; if (file) img = await uploadImage(file, "galeri");
      const row = { title: f.title || null, category: f.category || null, description: f.description || null, is_active: !!f.is_active, image_url: img };
      const r = f.id ? await sb.from("gallery").update(row).eq("id", f.id) : await sb.from("gallery").insert(row);
      if (r.error) throw r.error;
      say("Galeri berhasil disimpan."); setF(null); load();
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const del = async (g: any) => { if (!confirm("Hapus foto ini?")) return; await sb.from("gallery").delete().eq("id", g.id); say("Foto berhasil dihapus."); load(); };
  const toggle = async (g: any) => { await sb.from("gallery").update({ is_active: !g.is_active }).eq("id", g.id); load(); };
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-lgold">Galeri</h1><button onClick={() => open(null)} className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded">+ TAMBAH</button></div>
      <Toast msg={toast} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {items.map((g) => (
          <div key={g.id} className="bg-charcoal border border-gold/30 rounded-xl overflow-hidden">
            <div className="aspect-square bg-ink">{g.image_url && <img src={g.image_url} alt="" className="w-full h-full object-cover" />}</div>
            <div className="p-2"><p className="text-xs truncate">{g.title || "-"} {!g.is_active && <span className="text-silver">(nonaktif)</span>}</p>
              <div className="flex gap-1 mt-1 text-[11px]"><button onClick={() => open(g)} className="border border-gold/50 text-gold rounded px-2 py-1">Edit</button><button onClick={() => toggle(g)} className="border border-silver/40 rounded px-2 py-1">{g.is_active ? "Off" : "On"}</button><button onClick={() => del(g)} className="border border-red-400/60 text-red-400 rounded px-2 py-1">Hapus</button></div></div></div>))}
      </div>
      {f && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"><div className="max-w-lg mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
          <div className="flex justify-between"><h2 className="font-serif text-xl text-lgold">Foto Galeri</h2><button onClick={() => setF(null)} className="text-silver text-2xl">×</button></div>
          <label className="block text-xs text-silver">Judul<input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="block text-xs text-silver">Kategori<select value={f.category || ""} onChange={(e) => setF({ ...f, category: e.target.value })} className={cls + " mt-1"}><option value="">— pilih —</option><option>Kitchen Set</option><option>Bedroom Set</option><option>Apartment Set</option><option>Living Room</option><option>Custom Furniture</option><option>Office Furniture</option></select></label>
          <label className="block text-xs text-silver">Deskripsi<textarea value={f.description || ""} onChange={(e) => setF({ ...f, description: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Aktif</label>
          <div className="text-xs text-silver">Foto{(file || f.image_url) && <img src={file ? URL.createObjectURL(file) : f.image_url} alt="" className="h-24 rounded my-2" />}<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block mt-1" /></div>
          <button disabled={busy} onClick={save} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN"}</button>
        </div></div>)}
    </div>
  );
}
