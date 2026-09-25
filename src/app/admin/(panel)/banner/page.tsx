"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { uploadImage } from "@/lib/upload";
import Toast from "@/components/admin/Toast";
export default function Banner() {
  const sb = supabase();
  const [items, setItems] = useState<any[]>([]);
  const [f, setF] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState(""); const [busy, setBusy] = useState(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = async () => { const { data } = await sb.from("banners").select("*").order("sort_order"); setItems(data || []); };
  useEffect(() => { load(); }, []);
  const open = (b: any | null) => { setFile(null); setF(b ? { ...b } : { type: "hero", title: "", subtitle: "", button_text: "", button_url: "", sort_order: (items.length + 1) * 10, is_active: true, image_url: "" }); };
  const save = async () => {
    setBusy(true);
    try {
      let img = f.image_url || null; if (file) img = await uploadImage(file, "banner");
      const row = { type: f.type, title: f.title || null, subtitle: f.subtitle || null, button_text: f.button_text || null, button_url: f.button_url || null, sort_order: Number(f.sort_order) || 0, is_active: !!f.is_active, image_url: img };
      const r = f.id ? await sb.from("banners").update(row).eq("id", f.id) : await sb.from("banners").insert(row);
      if (r.error) throw r.error;
      say("Banner berhasil diperbarui."); setF(null); load();
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const del = async (b: any) => { if (!confirm("Hapus banner ini?")) return; await sb.from("banners").delete().eq("id", b.id); say("Banner berhasil dihapus."); load(); };
  const toggle = async (b: any) => { await sb.from("banners").update({ is_active: !b.is_active }).eq("id", b.id); load(); };
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-lgold">Banner</h1><button onClick={() => open(null)} className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded">+ TAMBAH</button></div>
      <Toast msg={toast} />
      <div className="mt-5 space-y-2">
        {items.map((b) => (
          <div key={b.id} className="bg-charcoal border border-gold/30 rounded-xl p-3 flex gap-3 items-center">
            <div className="w-16 h-12 bg-ink rounded overflow-hidden shrink-0">{b.image_url && <img src={b.image_url} alt="" className="w-full h-full object-cover" />}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{b.title || "(tanpa judul)"} {!b.is_active && <span className="text-xs text-silver">(nonaktif)</span>}</p>
              <div className="flex gap-2 mt-1 text-xs"><button onClick={() => open(b)} className="border border-gold/50 text-gold rounded px-2 py-1">Edit</button><button onClick={() => toggle(b)} className="border border-silver/40 rounded px-2 py-1">{b.is_active ? "Nonaktifkan" : "Aktifkan"}</button><button onClick={() => del(b)} className="border border-red-400/60 text-red-400 rounded px-2 py-1">Hapus</button></div></div></div>))}
      </div>
      {f && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"><div className="max-w-lg mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
          <div className="flex justify-between"><h2 className="font-serif text-xl text-lgold">Banner</h2><button onClick={() => setF(null)} className="text-silver text-2xl">×</button></div>
          <label className="block text-xs text-silver">Judul<input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="block text-xs text-silver">Subtitle<input value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} className={cls + " mt-1"} /></label>
          <div className="grid grid-cols-2 gap-3"><label className="block text-xs text-silver">Teks Tombol<input value={f.button_text} onChange={(e) => setF({ ...f, button_text: e.target.value })} className={cls + " mt-1"} /></label>
            <label className="block text-xs text-silver">URL Tombol<input value={f.button_url} onChange={(e) => setF({ ...f, button_url: e.target.value })} className={cls + " mt-1"} /></label></div>
          <label className="block text-xs text-silver">Urutan<input type="number" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Aktif</label>
          <div className="text-xs text-silver">Foto{(file || f.image_url) && <img src={file ? URL.createObjectURL(file) : f.image_url} alt="" className="h-24 rounded my-2" />}<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block mt-1" /></div>
          <button disabled={busy} onClick={save} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN"}</button>
        </div></div>)}
    </div>
  );
}
