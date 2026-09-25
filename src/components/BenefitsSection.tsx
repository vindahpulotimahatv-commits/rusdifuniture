import { Truck, ShieldCheck, Headphones, Wrench } from "lucide-react";
import { wa } from "@/lib/db";

const feats = [
  [Truck, "Pengiriman", "Seluruh Indonesia"],
  [ShieldCheck, "Garansi", "Produk"],
  [Headphones, "Layanan", "Konsultasi"],
  [Wrench, "Custom", "Sesuai Kebutuhan"],
] as const;

export default function BenefitsSection({ num }: { num: string }) {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-10 grid md:grid-cols-3 gap-5">
      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {feats.map(([Icon, a, b]) => (
          <div key={a} className="bg-charcoal border border-gold/20 rounded-xl p-4 text-center flex flex-col items-center gap-2">
            <Icon size={22} className="text-gold" />
            <p className="text-xs md:text-sm text-cream/90 leading-tight">{a}<br />{b}</p>
          </div>
        ))}
      </div>
      <div className="bg-charcoal border border-gold/30 rounded-xl p-5 flex flex-col justify-center">
        <p className="font-serif text-lg text-lgold">Furniture Custom</p>
        <p className="text-xs text-silver mt-2">Punya desain sendiri? Kami siap mewujudkan furniture sesuai keinginan Anda.</p>
        <a href={wa(num, "Halo Rusdi Furniture, saya ingin konsultasi mengenai furniture custom.")} className="inline-block mt-4 bg-gold text-ink text-xs font-semibold px-4 py-2.5 rounded-lg w-fit">
          Konsultasi Sekarang →
        </a>
      </div>
    </section>
  );
}
