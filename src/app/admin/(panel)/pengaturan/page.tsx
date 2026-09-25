"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { uploadImage } from "@/lib/upload";
import Toast from "@/components/admin/Toast";
const fields: [string, string][] = [["store_name", "Nama Toko"], ["subtitle", "Subjudul"], ["tagline", "Tagline"], ["whatsapp", "Nomor WhatsApp (62...)"], ["instagram", "Instagram"], ["facebook", "Facebook"], ["email", "Email"], ["address", "Alamat"], ["hours", "Jam Operasional"], ["maps_url", "Google Maps (URL)"], ["copyright", "Copyright Footer"]];
export default function Pengaturan() {
  const sb = supabase();
  const [v, setV] = useState<Record<string, string>>({});
  const [favicon, setFavicon] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [toast, setToast] = useState(""); const [busy, setBusy] = useState(false);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  useEffect(() => { sb.from("settings").select("key,value").then(({ data }) => { const o: any = {}; (data || []).forEach((r: any) => (o[r.key] = r.value)); setV(o); }); }, []);
  const save = async () => {
    setBusy(true);
    try {
      const extra: Record<string, string> = {};
      if (logo) extra.logo_url = await uploadImage(logo, "pengaturan");
      if (favicon) extra.favicon_url = await uploadImage(favicon, "pengaturan");
      const rows = Object.entries({ ...v, ...extra }).map(([key, value]) => ({ key, value: value ?? "" }));
      const r = await sb.from("settings").upsert(rows);
      if (r.error) throw r.error;
      say("Pengaturan berhasil disimpan.");
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl text-lgold">Pengaturan Website</h1>
      <Toast msg={toast} />
      <div className="mt-5 space-y-3">
        {fields.map(([k, label]) => (
          <label key={k} className="block text-xs text-silver">{label}<input value={v[k] || ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} className={cls + " mt-1"} /></label>))}
        <div className="text-xs text-silver">Logo{(logo || v.logo_url) && <img src={logo ? URL.createObjectURL(logo) : v.logo_url} alt="" className="h-16 my-2" />}<input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="block mt-1" /></div>
        <div className="text-xs text-silver">Favicon{(favicon || v.favicon_url) && <img src={favicon ? URL.createObjectURL(favicon) : v.favicon_url} alt="" className="h-10 my-2" />}<input type="file" accept="image/*" onChange={(e) => setFavicon(e.target.files?.[0] || null)} className="block mt-1" /></div>
        <button disabled={busy} onClick={save} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN PENGATURAN"}</button>
      </div>
    </div>
  );
}
