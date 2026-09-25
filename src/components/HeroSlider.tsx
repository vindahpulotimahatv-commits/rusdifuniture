"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { wa } from "@/lib/db";
type Banner = { id: string; image_url: string | null; title: string | null; subtitle: string | null; button_text: string | null; button_url: string | null };
export default function HeroSlider({ banners, num }: { banners: Banner[]; num: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);
  if (banners.length === 0) {
    return (
      <section className="relative bg-gradient-to-b from-charcoal to-ink py-20 md:py-32 text-center px-4">
        <p className="text-gold tracking-[0.3em] text-xs md:text-sm">RUSDI FURNITURE · CUSTOM BEKASI</p>
        <h1 className="font-serif text-3xl md:text-6xl mt-4 leading-tight">Furniture Berkualitas<br />untuk Rumah Impian Anda</h1>
        <p className="max-w-2xl mx-auto mt-5 text-silver text-sm md:text-base">Kami menyediakan berbagai pilihan furniture modern dan custom untuk ruang tamu, kamar tidur, ruang makan, kitchen set, hingga kebutuhan kantor.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/produk" className="bg-gold text-ink font-semibold px-7 py-3 rounded">BELANJA SEKARANG</Link>
          <a href={wa(num, "Halo Rusdi Furniture, saya ingin konsultasi.")} className="border border-gold text-gold px-7 py-3 rounded">KONSULTASI VIA WHATSAPP</a>
        </div>
      </section>
    );
  }
  const b = banners[i];
  return (
    <section className="relative h-[70vh] min-h-[420px] max-h-[640px] overflow-hidden">
      {banners.map((x, idx) => (
        <div key={x.id} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}>
          {x.image_url && <img src={x.image_url} alt={x.title || ""} className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        </div>
      ))}
      <div className="relative h-full flex flex-col items-center justify-end text-center px-4 pb-16 md:pb-24">
        <p className="text-gold tracking-[0.3em] text-xs md:text-sm">RUSDI FURNITURE · CUSTOM BEKASI</p>
        {b.title && <h1 className="font-serif text-3xl md:text-5xl mt-3 leading-tight max-w-3xl">{b.title}</h1>}
        {b.subtitle && <p className="max-w-2xl mx-auto mt-4 text-silver text-sm md:text-base">{b.subtitle}</p>}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {b.button_text && b.button_url && <a href={b.button_url} className="bg-gold text-ink font-semibold px-7 py-3 rounded">{b.button_text}</a>}
          <a href={wa(num, "Halo Rusdi Furniture, saya ingin konsultasi.")} className="border border-gold text-gold px-7 py-3 rounded">KONSULTASI VIA WHATSAPP</a>
        </div>
        {banners.length > 1 && (
          <>
            <button onClick={() => setI((i - 1 + banners.length) % banners.length)} aria-label="Sebelumnya" className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gold/50 text-gold bg-ink/40">‹</button>
            <button onClick={() => setI((i + 1) % banners.length)} aria-label="Berikutnya" className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gold/50 text-gold bg-ink/40">›</button>
            <div className="flex gap-2 mt-5">{banners.map((_, idx) => <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`w-2.5 h-2.5 rounded-full ${idx === i ? "bg-gold" : "bg-silver/40"}`} />)}</div>
          </>
        )}
      </div>
    </section>
  );
}
