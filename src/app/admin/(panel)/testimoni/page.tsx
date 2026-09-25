"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { uploadImage } from "@/lib/upload";
import Toast from "@/components/admin/Toast";
export default function Testimoni() {
  const sb = supabase();
  const [items, setItems] = useState<any[]>([]);
  const [f, setF] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState(""); const [busy, setBusy] = useState(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = async () => { const { data } = await sb.from("testimonials").select("*").order("created_at", { ascending: false }); setItems(data || []); };
  useEffect(() => { load(); }, []);
  const open = (t: any | null) => { setFile(null); setF(t ? { ...t } : { name: "", rating: 5, comment: "", is_active: true, photo_url: "" }); };
  const save = async () => {
    if (!f.name || !f.comment) { say("Nama dan komentar wajib diisi."); return; }
    setBusy(true);
    try {
      let img = f.photo_url || null; if (file) img = await uploadImage(file, "testimoni");
      const row = { name: f.name, rating: Number(f.rating) || 5, comment: f.comment, is_active: !!f.is_active, photo_url: img };
      const r = f.id ? await sb.from("testimonials").update(row).eq("id", f.id) : await sb.from("testimonials").insert(row);
      if (r.error) throw r.error;
      say("Testimoni berhasil disimpan."); setF(null); load();
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const del = async (t: any) => { if (!confirm("Hapus testimoni ini?")) return; await sb.from("testimonials").delete().eq("id", t.id); say("Testimoni berhasil dihapus."); load(); };
  const toggle = async (t: any) => { await sb.from("testimonials").update({ is_active: !t.is_active }).eq("id", t.id); load(); };
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-lgold">Testimoni</h1><button onClick={() => open(null)} className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded">+ TAMBAH</button></div>
      <Toast msg={toast} />
      <div className="mt-5 space-y-2">
        {items.map((t) => (
          <div key={t.id} className="bg-charcoal border border-gold/30 rounded-xl p-3 flex gap-3">
            <div className="w-12 h-12 bg-ink rounded-full overflow-hidden shrink-0">{t.photo_url && <img src={t.photo_url} alt="" className="w-full h-full object-cover" />}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium">{t.name} · ★{t.rating} {!t.is_active && <span className="text-xs text-silver">(nonaktif)</span>}</p>
              <p className="text-xs text-silver line-clamp-2">{t.comment}</p>
              <div className="flex gap-2 mt-1 text-xs"><button onClick={() => open(t)} className="border border-gold/50 text-gold rounded px-2 py-1">Edit</button><button onClick={() => toggle(t)} className="border border-silver/40 rounded px-2 py-1">{t.is_active ? "Nonaktifkan" : "Aktifkan"}</button><button onClick={() => del(t)} className="border border-red-400/60 text-red-400 rounded px-2 py-1">Hapus</button></div></div></div>))}
      </div>
      {f && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"><div className="max-w-lg mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
          <div className="flex justify-between"><h2 className="font-serif text-xl text-lgold">Testimoni</h2><button onClick={() => setF(null)} className="text-silver text-2xl">×</button></div>
          <label className="block text-xs text-silver">Nama<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={cls + " mt-1"} /></label>
          <label className="block text-xs text-silver">Rating<select value={f.rating} onChange={(e) => setF({ ...f, rating: e.target.value })} className={cls + " mt-1"}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
          <label className="block text-xs text-silver">Komentar<textarea value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })} className={cls + " mt-1"} rows={3} /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Aktif</label>
          <div className="text-xs text-silver">Foto (opsional){(file || f.photo_url) && <img src={file ? URL.createObjectURL(file) : f.photo_url} alt="" className="h-16 w-16 object-cover rounded-full my-2" />}<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block mt-1" /></div>
          <button disabled={busy} onClick={save} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN"}</button>
        </div></div>)}
    </div>
  );
}
