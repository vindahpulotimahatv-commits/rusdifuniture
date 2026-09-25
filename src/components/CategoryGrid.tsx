import Link from "next/link";
import { categoryIcon } from "@/lib/icons";
import { Settings } from "lucide-react";

type Cat = { id: string; name: string; slug: string };

export default function CategoryGrid({ cats }: { cats: Cat[] }) {
  const items = cats || [];
  const hasCustom = items.some((c) => /custom/i.test(c.name));
  return (
    <section id="kategori" className="max-w-7xl mx-auto px-4 pt-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        {items.map((c) => {
          const Icon = categoryIcon(c.name);
          return (
            <Link key={c.id} href={`/produk?kategori=${c.slug}`} className="group bg-charcoal border border-gold/20 hover:border-gold rounded-xl p-4 flex flex-col items-center gap-2 text-center transition">
              <span className="w-10 h-10 rounded-full border border-gold/40 grid place-items-center text-gold group-hover:bg-gold group-hover:text-ink transition">
                <Icon size={18} />
              </span>
              <span className="text-xs md:text-sm text-cream/90">{c.name}</span>
            </Link>
          );
        })}
        {!hasCustom && (
          <Link href="/produk?custom=1" className="group bg-charcoal border border-gold/20 hover:border-gold rounded-xl p-4 flex flex-col items-center gap-2 text-center transition">
            <span className="w-10 h-10 rounded-full border border-gold/40 grid place-items-center text-gold group-hover:bg-gold group-hover:text-ink transition">
              <Settings size={18} />
            </span>
            <span className="text-xs md:text-sm text-cream/90">Furniture Custom</span>
          </Link>
        )}
      </div>
    </section>
  );
}
