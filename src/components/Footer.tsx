import Link from "next/link";
export default function Footer({ s }: { s: Record<string, string> }) {
  return (
    <footer className="bg-ink border-t border-gold/20 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div><img src="/logo.jpeg" alt="Rusdi Furniture" className="h-20 w-auto mb-3" /><p className="text-sm text-silver">Furniture berkualitas untuk rumah impian Anda.</p></div>
        <div className="text-sm space-y-2"><p className="text-gold font-serif text-lg">Menu</p>
          <Link className="block" href="/">Home</Link><Link className="block" href="/produk">Produk</Link><Link className="block" href="/produk?promo=1">Promo</Link></div>
        <div className="text-sm space-y-2 text-silver"><p className="text-gold font-serif text-lg">Kontak</p>
          <p>WhatsApp: +62 812-9106-4259</p>
          {s.instagram && <p>Instagram: {s.instagram}</p>}
          {s.address && <p>{s.address}</p>}
          {s.hours && <p>{s.hours}</p>}</div>
      </div>
      <p className="text-center text-xs text-silver/70 py-4 border-t border-gold/10">© 2026 Rusdi Furniture. All Rights Reserved.</p>
    </footer>
  );
}
