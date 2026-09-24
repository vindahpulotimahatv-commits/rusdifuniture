"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, saveCart, total, cartText, fmt, type Item } from "@/lib/cart";
import { getSettings, wa } from "@/lib/db";
export default function Keranjang() {
  const [c, setC] = useState<Item[]>([]);
  const [num, setNum] = useState("6281291064259");
  useEffect(() => { setC(getCart()); getSettings().then((s) => setNum(s.whatsapp)); }, []);
  const set = (n: Item[]) => { setC(n); saveCart(n); };
  const chg = (id: string, d: number) => set(c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const msg = `Halo Rusdi Furniture, saya ingin memesan:\n\n${cartText(c)}\n\nTotal: ${fmt(total(c))}`;
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-lgold">Keranjang</h1>
      {c.length === 0 ? (
        <div className="text-center mt-12 text-silver"><p>Keranjang Anda masih kosong.</p><Link href="/produk" className="inline-block mt-4 bg-gold text-ink px-6 py-3 rounded font-semibold">LIHAT PRODUK</Link></div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {c.map((i) => (
              <div key={i.id} className="bg-charcoal border border-gold/30 rounded-xl p-3 flex gap-3 items-center">
                <div className="w-16 h-16 bg-ink rounded overflow-hidden shrink-0">{i.image && <img src={i.image} alt="" className="w-full h-full object-cover" />}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{i.name}</p><p className="text-lgold text-sm">{fmt(i.price)}</p>
                  <div className="flex items-center gap-2 mt-1"><button onClick={() => chg(i.id, -1)} className="w-8 h-8 border border-gold/40 rounded">−</button><span>{i.qty}</span><button onClick={() => chg(i.id, 1)} className="w-8 h-8 border border-gold/40 rounded">+</button>
                    <button onClick={() => set(c.filter((x) => x.id !== i.id))} className="ml-3 text-xs text-silver underline">Hapus</button></div></div>
                <p className="text-sm font-semibold">{fmt(i.price * i.qty)}</p>
              </div>))}
          </div>
          <div className="mt-6 flex justify-between text-lg"><span>Total</span><span className="text-lgold font-semibold">{fmt(total(c))}</span></div>
          <div className="mt-6 grid gap-3">
            <Link href="/checkout" className="text-center bg-gold text-ink font-semibold py-3 rounded">CHECKOUT</Link>
            <a href={wa(num, msg)} className="text-center border border-gold text-gold py-3 rounded">PESAN VIA WHATSAPP</a>
          </div>
        </>)}
    </div>
  );
}
