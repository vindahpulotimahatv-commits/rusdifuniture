import Link from "next/link";
import { wa } from "@/lib/db";
import { ShoppingCart } from "lucide-react";

export default function HeroIntro({ num }: { num: string }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 md:pt-12">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <img src="/logo.jpeg" alt="Rusdi Furniture Custom Bekasi" className="w-40 h-40 md:w-56 md:h-56 rounded-xl object-cover shrink-0" />
        <div className="text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-5xl leading-tight">
            <span className="text-cream">RUSDI</span> <span className="text-lgold">FURNITURE</span>
          </h1>
          <p className="text-gold tracking-[0.35em] text-xs md:text-sm mt-2">CUSTOM BEKASI</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link href="/produk" className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-6 py-3 rounded-lg hover:bg-lgold transition">
              <ShoppingCart size={16} /> Belanja Sekarang <span aria-hidden>→</span>
            </Link>
            <a href={wa(num, "Halo Rusdi Furniture, saya ingin konsultasi.")} className="inline-flex items-center gap-2 border border-gold/60 text-gold px-6 py-3 rounded-lg hover:bg-gold/10 transition">
              Konsultasi via WhatsApp <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
