type Banner = { id: string; image_url: string | null; title: string | null; subtitle: string | null; button_text: string | null; button_url: string | null };

export default function PromoHeroCard({ banner }: { banner: Banner | null }) {
  const img = banner?.image_url || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop";
  const buttonText = banner?.button_text || "Lihat Koleksi";
  const buttonUrl = banner?.button_url || "/produk";
  return (
    <div className="relative h-full min-h-[320px] rounded-2xl overflow-hidden border border-gold/20">
      <img src={img} alt={banner?.title || "Desain Modern Kualitas Terbaik"} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <h2 className="font-serif text-2xl md:text-3xl leading-tight">
          <span className="block text-cream italic">{banner?.title ? "" : "Desain Modern"}</span>
          <span className="block text-lgold">{banner?.title || "Kualitas Terbaik"}</span>
          {!banner?.title && <span className="block text-cream">Harga Bersahabat</span>}
        </h2>
        {banner?.subtitle && <p className="text-silver text-sm mt-2 max-w-sm">{banner.subtitle}</p>}
        <a href={buttonUrl} className="inline-flex items-center gap-2 w-fit mt-5 bg-gold text-ink font-semibold px-6 py-3 rounded-lg hover:bg-lgold transition">
          {buttonText} <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
