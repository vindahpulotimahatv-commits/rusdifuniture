import Link from "next/link";
import { db, wa, getSettings } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
export const revalidate = 30;
export default async function Home() {
  const s = await getSettings();
  const { data: cats } = await db().from("categories").select("*").eq("is_active", true).order("sort_order");
  const { data: all } = await db().from("products").select("category_id").eq("is_active", true);
  const { data: feat } = await db().from("products").select("*").eq("is_active", true).eq("is_featured", true).limit(8);
  const count = (id: string) => (all || []).filter((p: any) => p.category_id === id).length;
  const feats = [["PENGIRIMAN AMAN", "Ke seluruh Indonesia"], ["PRODUK BERKUALITAS", "Pilihan terbaik & tahan lama"], ["KONSULTASI GRATIS", "Kami siap membantu"], ["CUSTOM FURNITURE", "Sesuai ukuran & kebutuhan Anda"]];
  return (
    <>
      <section className="relative bg-gradient-to-b from-charcoal to-ink py-20 md:py-32 text-center px-4">
        <p className="text-gold tracking-[0.3em] text-xs md:text-sm">RUSDI FURNITURE · CUSTOM BEKASI</p>
        <h1 className="font-serif text-3xl md:text-6xl mt-4 leading-tight">Furniture Berkualitas<br />untuk Rumah Impian Anda</h1>
        <p className="max-w-2xl mx-auto mt-5 text-silver text-sm md:text-base">Kami menyediakan berbagai pilihan furniture modern dan custom untuk ruang tamu, kamar tidur, ruang makan, kitchen set, hingga kebutuhan kantor.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/produk" className="bg-gold text-ink font-semibold px-7 py-3 rounded">BELANJA SEKARANG</Link>
          <a href={wa(s.whatsapp, "Halo Rusdi Furniture, saya ingin konsultasi.")} className="border border-gold text-gold px-7 py-3 rounded">KONSULTASI VIA WHATSAPP</a>
        </div>
      </section>
      <section id="kategori" className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="font-serif text-2xl md:text-3xl text-lgold text-center">Kategori Produk</h2>
        <p className="text-center text-silver text-sm mt-2">Temukan furniture sesuai kebutuhan Anda</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mt-8">
          {(cats || []).map((c: any) => (
            <Link key={c.id} href={`/produk?kategori=${c.slug}`} className="bg-charcoal border border-gold/30 hover:border-gold rounded-xl p-5 text-center transition hover:-translate-y-1">
              <p className="font-serif text-lg">{c.name}</p><p className="text-xs text-silver mt-1">{count(c.id)} produk</p>
            </Link>))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <h2 className="font-serif text-2xl md:text-3xl text-lgold text-center">Produk Unggulan</h2>
        <p className="text-center text-silver text-sm mt-2">Pilihan furniture favorit untuk hunian Anda</p>
        {(feat || []).length === 0 ? <p className="text-center text-silver mt-8">Belum ada produk unggulan.</p> :
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-8">{(feat || []).map((p: any) => <ProductCard key={p.id} p={p} />)}</div>}
      </section>
      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="bg-charcoal border border-gold/40 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-lgold">Furniture Custom Sesuai Keinginan Anda</h2>
          <p className="text-silver mt-3 max-w-2xl mx-auto text-sm">Memiliki desain sendiri? Kami siap membantu mewujudkan furniture sesuai ukuran, warna, material dan kebutuhan ruangan Anda.</p>
          <a href={wa(s.whatsapp, "Halo Rusdi Furniture, saya ingin konsultasi mengenai furniture custom.")} className="inline-block mt-6 bg-gold text-ink font-semibold px-7 py-3 rounded">KONSULTASI CUSTOM</a>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {feats.map(([t, d]) => <div key={t} className="text-center p-4 border border-gold/20 rounded-xl"><p className="text-gold text-sm font-semibold">{t}</p><p className="text-xs text-silver mt-1">{d}</p></div>)}
      </section>
    </>
  );
}
