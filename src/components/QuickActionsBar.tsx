import Link from "next/link";
import { Crown, Flame, CheckCircle2, XCircle, Heart, Share2, Eye, Truck, Facebook, Music2, Youtube, MessageCircle } from "lucide-react";

export default function QuickActionsBar({ s }: { s: Record<string, string> }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Link href="/produk?featured=1" className="inline-flex items-center gap-1.5 bg-gold/15 border border-gold text-lgold text-xs font-medium px-3 py-2 rounded-full">
          <Crown size={13} /> Best Seller
        </Link>
        <Link href="/produk?promo=1" className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-full">
          <Flame size={13} /> Promo
        </Link>
        <span className="inline-flex items-center gap-1.5 bg-charcoal border border-gold/30 text-cream/90 text-xs px-3 py-2 rounded-full">
          <CheckCircle2 size={13} className="text-gold" /> Stok Tersedia
        </span>
        <span className="inline-flex items-center gap-1.5 bg-charcoal border border-gold/20 text-silver text-xs px-3 py-2 rounded-full">
          <XCircle size={13} /> Stok Habis
        </span>

        <span className="w-px h-6 bg-gold/20 mx-1 hidden sm:block" />

        <div className="flex items-center gap-2 ml-auto">
          {[Heart, Share2, Eye, Truck].map((Icon, i) => (
            <span key={i} className="w-8 h-8 rounded-full border border-gold/30 text-gold grid place-items-center">
              <Icon size={14} />
            </span>
          ))}
          <a href={s.facebook || "#"} target="_blank" aria-label="Facebook" className="w-8 h-8 rounded-full border border-gold/30 text-gold grid place-items-center hover:bg-gold hover:text-ink transition">
            <Facebook size={14} />
          </a>
          <a href={s.tiktok || "#"} target="_blank" aria-label="TikTok" className="w-8 h-8 rounded-full border border-gold/30 text-gold grid place-items-center hover:bg-gold hover:text-ink transition">
            <Music2 size={14} />
          </a>
          <a href={s.youtube || "#"} target="_blank" aria-label="YouTube" className="w-8 h-8 rounded-full border border-gold/30 text-gold grid place-items-center hover:bg-gold hover:text-ink transition">
            <Youtube size={14} />
          </a>
          <a href={`https://wa.me/${s.whatsapp}`} target="_blank" aria-label="WhatsApp" className="w-8 h-8 rounded-full border border-gold/30 text-gold grid place-items-center hover:bg-gold hover:text-ink transition">
            <MessageCircle size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
