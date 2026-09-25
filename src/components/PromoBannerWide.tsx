import Link from "next/link";

export default function PromoBannerWide({ percent = 30 }: { percent?: number }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-gold/20 min-h-[140px]">
      <img
        src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200&auto=format&fit=crop"
        alt="Promo furniture"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
      <div className="relative flex flex-col justify-center h-full p-5 md:p-6">
        <p className="text-lgold text-xs tracking-[0.25em]">PROMO BULAN INI</p>
        <h3 className="font-serif text-xl md:text-2xl mt-1">
          <span className="text-cream">DISKON </span>
          <span className="text-lgold">FURNITURE</span>
        </h3>
        <p className="font-serif text-lg md:text-xl text-cream">
          HINGGA <span className="text-lgold">{percent}%</span>
        </p>
        <Link href="/produk?promo=1" className="inline-flex items-center gap-2 w-fit mt-3 bg-gold text-ink text-sm font-semibold px-4 py-2 rounded-lg hover:bg-lgold transition">
          Belanja Sekarang <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
