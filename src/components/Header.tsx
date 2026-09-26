import Link from "next/link";
import { Search, User } from "lucide-react";
import CartLink from "./CartLink";

const nav: [string, string][] = [
  ["Home", "/"],
  ["Produk", "/produk"],
  ["Kategori", "/#kategori"],
  ["Promo", "/produk?promo=1"],
  ["Galeri", "/#galeri"],
  ["Tentang Kami", "/tentang-kami"],
  ["Karir", "/karir"],
  ["Kontak", "/kontak"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.jpeg" alt="Rusdi Furniture Custom Bekasi" className="h-9 w-9 rounded object-cover" />
          <span className="hidden sm:block leading-tight">
            <span className="block font-serif text-sm tracking-wide text-cream">RUSDI FURNITURE</span>
            <span className="block text-[9px] tracking-[0.2em] text-gold">CUSTOM BEKASI</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm ml-2">
          {nav.map(([t, h], i) => (
            <Link key={t} href={h} className={`transition hover:text-gold ${i === 0 ? "text-gold border-b border-gold pb-1" : "text-cream/90"}`}>
              {t}
            </Link>
          ))}
        </nav>

        <div className="flex-1 hidden md:flex justify-end">
          <form action="/produk" className="relative w-full max-w-[260px]">
            <input name="q" placeholder="Cari produk..." className="w-full bg-charcoal border border-gold/30 rounded-full pl-4 pr-9 py-2 text-xs placeholder:text-silver/60 focus:outline-none focus:border-gold" />
            <button aria-label="Cari" className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gold text-ink grid place-items-center">
              <Search size={14} />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3 ml-auto md:ml-0">
          <Link href="/admin/login" aria-label="Akun" className="w-9 h-9 rounded-full border border-gold/30 text-gold grid place-items-center hover:border-gold">
            <User size={16} />
          </Link>
          <CartLink />
          <details className="lg:hidden relative">
            <summary className="list-none cursor-pointer text-gold text-2xl px-1" aria-label="Menu">☰</summary>
            <div className="absolute right-0 top-10 w-52 bg-charcoal border border-gold/30 rounded-lg p-2 z-50">
              {nav.map(([t, h]) => (
                <Link key={t} href={h} className="block px-3 py-3 text-sm hover:text-gold">{t}</Link>
              ))}
              <form action="/produk" className="relative mt-1 px-1 pb-1">
                <input name="q" placeholder="Cari produk..." className="w-full bg-ink border border-gold/30 rounded-full pl-3 pr-8 py-2 text-xs" />
                <button aria-label="Cari" className="absolute right-2 top-1/2 -translate-y-1/2 text-gold"><Search size={14} /></button>
              </form>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
