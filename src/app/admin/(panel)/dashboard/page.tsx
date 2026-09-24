"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
export default function Dashboard() {
  const [n, setN] = useState<Record<string, number | null>>({});
  useEffect(() => {
    const sb = supabase();
    const c = (t: string, f?: (q: any) => any) => { let q: any = sb.from(t).select("id", { count: "exact", head: true }); if (f) q = f(q); return q.then((r: any) => r.count ?? 0); };
    Promise.all([
      c("products"), c("products", (q) => q.eq("is_active", true)), c("products", (q) => q.lte("stock", 0)),
      c("orders", (q) => q.eq("status", "BARU")), c("orders"), c("products", (q) => q.not("promo_price", "is", null)),
    ]).then(([a, b, d, e, f, g]) => setN({ a, b, d, e, f, g }));
  }, []);
  const cards: [string, string][] = [["TOTAL PRODUK", "a"], ["PRODUK AKTIF", "b"], ["STOK HABIS", "d"], ["PESANAN BARU", "e"], ["TOTAL PESANAN", "f"], ["PRODUK PROMO", "g"]];
  return (
    <div>
      <h1 className="font-serif text-2xl text-lgold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {cards.map(([t, k]) => <div key={k} className="bg-charcoal border border-gold/30 rounded-xl p-4"><p className="text-xs text-silver">{t}</p><p className="text-3xl text-gold font-serif mt-1">{n[k] ?? "…"}</p></div>)}
      </div>
    </div>
  );
}
