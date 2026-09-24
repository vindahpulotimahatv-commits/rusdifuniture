"use client";
import { useEffect, useState } from "react";
import { getCart, saveCart, total, cartText, fmt, type Item } from "@/lib/cart";
import { db, getSettings, wa } from "@/lib/db";
export default function Checkout() {
  const [c, setC] = useState<Item[]>([]);
  const [num, setNum] = useState("6281291064259");
  const [f, setF] = useState({ nama: "", hp: "", alamat: "", catatan: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { setC(getCart()); getSettings().then((s) => setNum(s.whatsapp)); }, []);
  const inp = "w-full bg-charcoal border border-gold/30 rounded px-3 py-3 text-sm";
  async function kirim(e: React.FormEvent) {
    e.preventDefault(); if (c.length === 0) return;
    setBusy(true); setErr("");
    const id = crypto.randomUUID();
    const no = "RF-" + Date.now().toString().slice(-8);
    const o = await db().from("orders").insert({ id, order_no: no, customer_name: f.nama, whatsapp: f.hp, address: f.alamat, note: f.catatan, total: total(c) });
    if (o.error) { setErr("Pesanan gagal disimpan. Coba lagi."); setBusy(false); return; }
    await db().from("order_items").insert(c.map((i) => ({ order_id: id, product_id: i.id, product_name: i.name, qty: i.qty, price: i.price })));
    const msg = `Halo Rusdi Furniture, saya ingin memesan (No. ${no}):\n\n${cartText(c)}\n\nTotal: ${fmt(total(c))}\n\nNama: ${f.nama}\nWhatsApp: ${f.hp}\nAlamat: ${f.alamat}\nCatatan: ${f.catatan || "-"}`;
    saveCart([]);
    window.location.href = wa(num, msg);
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-lgold">Checkout</h1>
      {c.length === 0 ? <p className="mt-8 text-silver">Keranjang kosong. <a className="underline text-gold" href="/produk">Lihat produk</a></p> : (
        <form onSubmit={kirim} className="mt-6 space-y-3">
          <input required placeholder="Nama" className={inp} value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} />
          <input required placeholder="Nomor WhatsApp" inputMode="tel" className={inp} value={f.hp} onChange={(e) => setF({ ...f, hp: e.target.value })} />
          <textarea required placeholder="Alamat lengkap" rows={3} className={inp} value={f.alamat} onChange={(e) => setF({ ...f, alamat: e.target.value })} />
          <textarea placeholder="Catatan (opsional)" rows={2} className={inp} value={f.catatan} onChange={(e) => setF({ ...f, catatan: e.target.value })} />
          <div className="bg-charcoal border border-gold/30 rounded-xl p-4 text-sm space-y-1">
            {c.map((i) => <div key={i.id} className="flex justify-between gap-3"><span>{i.name} x{i.qty}</span><span>{fmt(i.price * i.qty)}</span></div>)}
            <div className="flex justify-between font-semibold text-lgold pt-2 border-t border-gold/20"><span>Total</span><span>{fmt(total(c))}</span></div>
          </div>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <button disabled={busy} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MEMPROSES..." : "KIRIM PESAN VIA WHATSAPP"}</button>
        </form>)}
    </div>
  );
}
