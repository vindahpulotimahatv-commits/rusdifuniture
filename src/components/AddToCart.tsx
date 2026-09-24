"use client";
import { useState } from "react";
import { addItem, fmt } from "@/lib/cart";
import { wa } from "@/lib/db";
export default function AddToCart({ p, num }: { p: { id: string; name: string; price: number; image: string | null; slug: string }; num: string }) {
  const [q, setQ] = useState(1);
  const [ok, setOk] = useState(false);
  const msg = `Halo Rusdi Furniture,\n\nSaya tertarik dengan produk:\n\n${p.name}\n\nHarga:\n${fmt(p.price)}\n\nJumlah:\n${q}\n\nSaya ingin mendapatkan informasi lebih lanjut.`;
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-silver">Jumlah</span>
        <button onClick={() => setQ(Math.max(1, q - 1))} className="w-10 h-10 border border-gold/50 rounded">−</button>
        <span className="w-8 text-center">{q}</span>
        <button onClick={() => setQ(q + 1)} className="w-10 h-10 border border-gold/50 rounded">+</button>
      </div>
      <button onClick={() => { addItem(p, q); setOk(true); }} className="w-full border border-gold text-gold py-3 rounded font-semibold">TAMBAH KE KERANJANG</button>
      {ok && <p className="text-sm text-lgold">Produk ditambahkan ke keranjang. <a href="/keranjang" className="underline">Lihat keranjang</a></p>}
      <a href={wa(num, msg)} className="block text-center bg-gold text-ink font-semibold py-3 rounded">BELI / PESAN VIA WHATSAPP</a>
    </div>
  );
}
