"use client";
import { Search, LayoutGrid, List, ChevronRight } from "lucide-react";
import { useState } from "react";

type Cat = { name: string; slug: string };

export default function ShopSidebar({ cats }: { cats: Cat[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  return (
    <form action="/produk" className="h-full bg-charcoal border border-gold/20 rounded-2xl p-4 md:p-5 flex flex-col gap-4">
      <div className="relative">
        <input name="q" placeholder="Cari produk..." className="w-full bg-ink border border-gold/30 rounded-lg pl-3 pr-9 py-2.5 text-sm placeholder:text-silver/50 focus:outline-none focus:border-gold" />
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold" />
      </div>

      <select name="kategori" defaultValue="" className="w-full bg-ink border border-gold/30 rounded-lg px-3 py-2.5 text-sm">
        <option value="">Semua Kategori</option>
        {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>

      <div>
        <p className="text-xs text-silver mb-2">Harga</p>
        <div className="flex items-center gap-2">
          <input name="min" defaultValue="0" className="w-1/2 bg-ink border border-gold/30 rounded-lg px-2 py-2 text-xs" />
          <span className="text-silver">–</span>
          <input name="max" defaultValue="10000000" className="w-1/2 bg-ink border border-gold/30 rounded-lg px-2 py-2 text-xs" />
        </div>
        <div className="h-1.5 rounded-full bg-ink border border-gold/20 mt-3 relative">
          <div className="absolute left-0 top-0 h-full w-3/4 bg-gold rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setView("grid")} aria-label="Tampilan grid" className={`w-9 h-9 rounded-lg grid place-items-center border ${view === "grid" ? "bg-gold text-ink border-gold" : "border-gold/30 text-gold"}`}>
          <LayoutGrid size={15} />
        </button>
        <button type="button" onClick={() => setView("list")} aria-label="Tampilan list" className={`w-9 h-9 rounded-lg grid place-items-center border ${view === "list" ? "bg-gold text-ink border-gold" : "border-gold/30 text-gold"}`}>
          <List size={15} />
        </button>
      </div>

      <button className="bg-gold text-ink font-semibold rounded-lg py-2.5 text-sm">TERAPKAN FILTER</button>

      <div className="flex items-center justify-center gap-2 mt-auto pt-2">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`w-8 h-8 rounded-lg grid place-items-center text-xs ${n === 1 ? "bg-gold text-ink font-semibold" : "border border-gold/30 text-silver"}`}>{n}</span>
        ))}
        <span className="w-8 h-8 rounded-lg border border-gold/30 text-gold grid place-items-center"><ChevronRight size={14} /></span>
      </div>
    </form>
  );
}
