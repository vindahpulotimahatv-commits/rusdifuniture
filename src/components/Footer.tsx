import Link from "next/link";
import { Sparkles, Crown, ShieldCheck, ThumbsUp } from "lucide-react";

const badges = [
  [Sparkles, "Modern"],
  [Crown, "Elegan"],
  [ShieldCheck, "Tahan Lama"],
  [ThumbsUp, "Terpercaya"],
] as const;

export default function Footer({ s }: { s: Record<string, string> }) {
  return (
    <footer className="bg-ink border-t border-gold/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="Rusdi Furniture" className="h-14 w-14 rounded object-cover" />
          <span>
            <span className="block font-serif text-base text-cream">{s.store_name || "RUSDI FURNITURE"}</span>
            <span className="block text-[10px] tracking-[0.2em] text-gold">{s.subtitle || "CUSTOM BEKASI"}</span>
          </span>
        </Link>
        <p className="text-silver text-sm italic text-center md:text-left">
          {s.tagline || "Furniture Berkualitas untuk Rumah Impian Anda"}
        </p>
        <div className="flex items-center gap-6">
          {badges.map(([Icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1.5 text-gold">
              <span className="w-10 h-10 rounded-full border border-gold/40 grid place-items-center"><Icon size={16} /></span>
              <span className="text-[11px] text-silver">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-xs text-silver/70 py-4 border-t border-gold/10">
        {s.copyright || "© 2026 Rusdi Furniture. All Rights Reserved."}
      </p>
    </footer>
  );
}
