"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Toast from "@/components/admin/Toast";
const rp = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");
const st = ["BARU", "DIPROSES", "SELESAI", "DIBATALKAN"];
export default function Pesanan() {
  const sb = supabase();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState<any | null>(null);
  const [detail, setDetail] = useState<any[]>([]);
  const [toast, setToast] = useState("");
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };
  const load = async () => { const { data } = await sb.from("orders").select("*").order("created_at", { ascending: false }); setItems(data || []); };
  useEffect(() => { load(); }, []);
  const view = async (o: any) => { setOpen(o); const { data } = await sb.from("order_items").select("*").eq("order_id", o.id); setDetail(data || []); };
  const chg = async (o: any, status: string) => { await sb.from("orders").update({ status }).eq("id", o.id); say("Status pesanan diperbarui."); setOpen(null); load(); };
  const badge = (s: string) => ({ BARU: "bg-gold text-ink", DIPROSES: "bg-blue-500/20 text-blue-300", SELESAI: "bg-green-500/20 text-green-300", DIBATALKAN: "bg-red-500/20 text-red-300" } as any)[s] || "";
  return (
    <div>
      <h1 className="font-serif text-2xl text-lgold">Pesanan</h1>
      <Toast msg={toast} />
      {items.length === 0 ? <p className="text-silver mt-6">Belum ada pesanan.</p> : (
        <div className="mt-5 space-y-2">
          {items.map((o) => (
            <button key={o.id} onClick={() => view(o)} className="w-full text-left bg-charcoal border border-gold/30 rounded-xl p-3">
              <div className="flex justify-between items-start"><div><p className="text-sm font-medium">{o.order_no}</p><p className="text-xs text-silver">{o.customer_name} · {o.whatsapp}</p></div>
                <span className={`text-xs px-2 py-1 rounded ${badge(o.status)}`}>{o.status}</span></div>
              <p className="text-lgold text-sm mt-1">{rp(o.total)}</p>
            </button>))}
        </div>)}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"><div className="max-w-lg mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
          <div className="flex justify-between"><h2 className="font-serif text-xl text-lgold">{open.order_no}</h2><button onClick={() => setOpen(null)} className="text-silver text-2xl">×</button></div>
          <div className="text-sm space-y-1 text-silver"><p>Nama: {open.customer_name}</p><p>WhatsApp: {open.whatsapp}</p><p>Alamat: {open.address}</p>{open.note && <p>Catatan: {open.note}</p>}</div>
          <div className="border-t border-gold/20 pt-2 text-sm space-y-1">{detail.map((d) => <div key={d.id} className="flex justify-between"><span>{d.product_name} x{d.qty}</span><span>{rp(d.price * d.qty)}</span></div>)}
            <div className="flex justify-between font-semibold text-lgold pt-1"><span>Total</span><span>{rp(open.total)}</span></div></div>
          <label className="block text-xs text-silver">Ubah Status<select value={open.status} onChange={(e) => chg(open, e.target.value)} className="w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm mt-1">{st.map((s) => <option key={s}>{s}</option>)}</select></label>
        </div></div>)}
    </div>
  );
}
