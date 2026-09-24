import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";
export default async function Produk({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const sp = searchParams;
  const { data: cats } = await db().from("categories").select("name,slug").eq("is_active", true).order("sort_order");
  let q: any = db().from("products").select("*").eq("is_active", true);
  if (sp.q) q = q.ilike("name", `%${sp.q}%`);
  if (sp.promo) q = q.not("promo_price", "is", null);
  if (sp.kategori) {
    const { data: c } = await db().from("categories").select("id").eq("slug", sp.kategori).maybeSingle();
    if (c) q = q.eq("category_id", c.id);
  }
  q = sp.sort === "murah" ? q.order("price") : sp.sort === "mahal" ? q.order("price", { ascending: false }) : q.order("created_at", { ascending: false });
  const { data: items } = await q;
  const inp = "bg-charcoal border border-gold/30 rounded px-3 py-2 text-sm";
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-lgold">{sp.promo ? "Promo" : "Produk"}</h1>
      <form className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Cari produk..." className={inp + " col-span-2"} />
        <select name="kategori" defaultValue={sp.kategori || ""} className={inp}><option value="">Semua kategori</option>{(cats || []).map((c: any) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <select name="sort" defaultValue={sp.sort || ""} className={inp}><option value="">Terbaru</option><option value="murah">Harga terendah</option><option value="mahal">Harga tertinggi</option></select>
        <button className="bg-gold text-ink font-semibold rounded py-2 text-sm">TERAPKAN</button>
        {sp.promo && <input type="hidden" name="promo" value="1" />}
      </form>
      {(items || []).length === 0 ? <p className="text-silver mt-10 text-center">Produk tidak ditemukan.</p> :
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-8">{(items || []).map((p: any) => <ProductCard key={p.id} p={p} />)}</div>}
    </div>
  );
}
