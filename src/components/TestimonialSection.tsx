export default function TestimonialSection({ items }: { items: { id: string; name: string; rating: number; comment: string; photo_url: string | null }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 pt-16">
      <h2 className="font-serif text-2xl md:text-3xl text-lgold text-center">Testimoni Pelanggan</h2>
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {items.map((t) => (
          <div key={t.id} className="bg-charcoal border border-gold/20 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ink overflow-hidden shrink-0">{t.photo_url && <img src={t.photo_url} alt="" className="w-full h-full object-cover" />}</div>
              <div><p className="text-sm font-medium">{t.name}</p><p className="text-gold text-xs">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</p></div>
            </div>
            <p className="text-sm text-silver mt-3">{t.comment}</p>
          </div>))}
      </div>
    </section>
  );
}
