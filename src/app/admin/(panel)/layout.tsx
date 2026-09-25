"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
const menu: [string, string][] = [["Dashboard", "/admin/dashboard"], ["Produk", "/admin/produk"], ["Kategori", "/admin/kategori"], ["Pesanan", "/admin/pesanan"], ["Promo", "/admin/promo"], ["Banner", "/admin/banner"], ["Galeri", "/admin/galeri"], ["Testimoni", "/admin/testimoni"], ["Pengaturan", "/admin/pengaturan"]];
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  const [open, setOpen] = useState(false);
  const logout = async () => { await supabase().auth.signOut(); location.href = "/admin/login"; };
  const nav = (
    <nav className="p-3 space-y-1">
      {menu.map(([t, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className={`block px-3 py-3 rounded text-sm ${p === h ? "bg-gold text-ink font-semibold" : "hover:bg-white/5"}`}>{t}</Link>)}
      <Link href="/" className="block px-3 py-3 text-sm text-silver">Lihat Website</Link>
      <button onClick={logout} className="w-full text-left px-3 py-3 text-sm text-silver">Logout</button>
    </nav>
  );
  return (
    <div className="min-h-screen md:flex bg-ink">
      <aside className="hidden md:block w-56 bg-charcoal border-r border-gold/20 shrink-0 overflow-y-auto"><img src="/logo.jpeg" alt="" className="w-40 mx-auto mt-4" />{nav}</aside>
      <div className="md:hidden sticky top-0 z-40 bg-charcoal border-b border-gold/20 flex items-center justify-between px-4 h-14"><img src="/logo.jpeg" alt="" className="h-9" /><button onClick={() => setOpen(!open)} className="text-gold text-2xl">☰</button></div>
      {open && <div className="md:hidden fixed inset-0 top-14 z-30 bg-charcoal overflow-y-auto">{nav}</div>}
      <main className="flex-1 p-4 md:p-8 min-w-0">{children}</main>
    </div>
  );
}
