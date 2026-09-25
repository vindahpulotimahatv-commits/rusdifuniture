import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { rp } from "@/lib/db";
export default function ProductCard({ p }: { p: any }) {
  const promo = p.promo_price && Number(p.promo_price) < Number(p.price);
  const tersedia = (p.stock_status || "tersedia") === "tersedia";
  return (
    <div className="group bg-charcoal border border-gold/30 rounded-xl overflow-hidden hover:border-gold transition">
      <Link href={`/produk/${p.slug}`} className="block">
        <div className="aspect-square bg-ink relative overflow-hidden">
          {p.main_image ? <img src={p.main_image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : <div className="w-full h-full grid place-items-center text-gold/40 font-serif text-2xl">RF</div>}
          {p.badge && <span className="absolute top-2 left-2 bg-gold text-ink text-[10px] font-semibold px-2 py-1 rounded">{p.badge}</span>}
        </div>
      </Link>
      <div className="p-3 space-y-1.5">
        <Link href={`/produk/${p.slug}`}><h3 className="text-sm font-medium line-clamp-2 hover:text-gold transition">{p.name}</h3></Link>
        <div className="flex items-baseline gap-2">
          <p className="text-lgold font-semibold">{rp(promo ? p.promo_price : p.price)}</p>
          {promo && <p className="text-xs text-silver line-through">{rp(p.price)}</p>}
        </div>
        <div className="flex items-center justify-between text-xs">
          {Number(p.review_count) > 0 ? (
            <span className="flex items-center gap-1 text-silver"><Star size={12} className="fill-gold text-gold" /> {p.rating} ({p.review_count})</span>
          ) : <span />}
          <span className={`flex items-center gap-1 ${tersedia ? "text-green-400" : "text-silver/60"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tersedia ? "bg-green-400" : "bg-silver/50"}`} /> {tersedia ? "Tersedia" : "Habis"}
          </span>
        </div>
        <div className="flex gap-2 pt-1.5">
          <Link href={`/produk/${p.slug}`} className="flex-1 text-center text-xs bg-gold text-ink font-semibold rounded py-2">LIHAT DETAIL</Link>
          <Link href={`/produk/${p.slug}`} aria-label="Tambah ke keranjang" className="w-9 shrink-0 grid place-items-center border border-gold text-gold rounded">
            <ShoppingCart size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
