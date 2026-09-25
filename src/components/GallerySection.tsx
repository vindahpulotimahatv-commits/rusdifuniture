"use client";
import { useState } from "react";
export default function GallerySection({ items }: { items: { id: string; image_url: string; title: string | null }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (items.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-4 pt-16">
      <h2 className="font-serif text-2xl md:text-3xl text-lgold text-center">Galeri Rusdi Furniture</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
        {items.map((g) => (
          <button key={g.id} onClick={() => setOpen(g.image_url)} className="aspect-square bg-charcoal border border-gold/20 rounded-lg overflow-hidden">
            <img src={g.image_url} alt={g.title || ""} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
          </button>))}
      </div>
      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-4">
          <img src={open} alt="" className="max-w-full max-h-full rounded-lg" />
          <button onClick={() => setOpen(null)} className="absolute top-4 right-4 text-white text-3xl">×</button>
        </div>)}
    </section>
  );
}
