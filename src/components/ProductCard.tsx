import Link from "next/link";
import { rp } from "@/lib/db";
export default function ProductCard({ p }: { p: any }) {
  const promo = p.promo_price && Number(p.promo_price) < Number(p.price);
  return (
    <Link href={`/produk/${p.slug}`} className="group block bg-charcoal border border-gold/30 rounded-xl overflow-hidden hover:border-gold transition">
      <div className="aspect-square bg-ink relative overflow-hidden">
        {p.main_image ? <img src={p.main_image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : <div className="w-full h-full grid place-items-center text-gold/40 font-serif text-2xl">RF</div>}
        {p.badge && <span className="absolute top-2 left-2 bg-gold text-ink text-[10px] font-semibold px-2 py-1 rounded">{p.badge}</span>}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-medium line-clamp-2">{p.name}</h3>
        <p className="text-lgold font-semibold">{rp(promo ? p.promo_price : p.price)}</p>
        {promo && <p className="text-xs text-silver line-through">{rp(p.price)}</p>}
        {Number(p.review_count) > 0 && <p className="text-xs text-silver">★ {p.rating} ({p.review_count})</p>}
        <span className="block text-center text-xs border border-gold text-gold rounded py-2 mt-2">LIHAT DETAIL</span>
      </div>
    </Link>
  );
}
