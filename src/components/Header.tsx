import Link from "next/link";
const nav: [string, string][] = [["Home", "/"], ["Produk", "/produk"], ["Kategori", "/#kategori"], ["Promo", "/produk?promo=1"]];
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/"><img src="/logo.jpeg" alt="Rusdi Furniture Custom Bekasi" className="h-11 w-auto" /></Link>
        <nav className="hidden md:flex gap-7 text-sm">
          {nav.map(([t, h]) => <Link key={t} href={h} className="hover:text-gold transition">{t}</Link>)}
        </nav>
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer text-gold text-2xl px-2" aria-label="Menu">☰</summary>
          <div className="absolute right-0 top-10 w-48 bg-charcoal border border-gold/30 rounded-lg p-2">
            {nav.map(([t, h]) => <Link key={t} href={h} className="block px-3 py-3 text-sm hover:text-gold">{t}</Link>)}
          </div>
        </details>
      </div>
    </header>
  );
}
