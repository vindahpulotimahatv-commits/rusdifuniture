import { notFound } from "next/navigation";
import { db, rp, wa, getSettings } from "@/lib/db";
export const dynamic = "force-dynamic";
async function load(slug: string) {
  const { data } = await db().from("products").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  return data;
}
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await load(params.slug);
  return { title: p ? `${p.name} | Rusdi Furniture` : "Produk", description: p?.description?.slice(0, 150) };
}
export default async function Detail({ params }: { params: { slug: string } }) {
  const p: any = await load(params.slug);
  if (!p) notFound();
  const s = await getSettings();
  const { data: imgs } = await db().from("product_images").select("url").eq("product_id", p.id).order("sort_order");
  const photos: string[] = [p.main_image, ...(imgs || []).map((i: any) => i.url)].filter(Boolean);
  const promo = p.promo_price && Number(p.promo_price) < Number(p.price);
  const harga = rp(promo ? p.promo_price : p.price);
  const msg = `Halo Rusdi Furniture,\n\nSaya tertarik dengan produk:\n\n${p.name}\n\nHarga:\n${harga}\n\nJumlah:\n1\n\nSaya ingin mendapatkan informasi lebih lanjut.`;
  const spec: [string, string][] = [["Kode", p.code], ["Material", p.material], ["Ukuran", p.size], ["Warna", p.color], ["Berat", p.weight]].filter(([, v]) => v) as [string, string][];
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square bg-charcoal border border-gold/30 rounded-xl overflow-hidden grid place-items-center">
          {photos[0] ? <img src={photos[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-gold/40 font-serif text-4xl">RF</span>}
        </div>
        {photos.length > 1 && <div className="flex gap-2 mt-3 overflow-x-auto">{photos.map((u) => <img key={u} src={u} alt="" loading="lazy" className="h-20 w-20 object-cover rounded border border-gold/30" />)}</div>}
      </div>
      <div>
        {p.badge && <span className="bg-gold text-ink text-xs font-semibold px-2 py-1 rounded">{p.badge}</span>}
        <h1 className="font-serif text-2xl md:text-3xl mt-2">{p.name}</h1>
        <p className="text-2xl text-lgold font-semibold mt-3">{harga}</p>
        {promo && <p className="text-silver line-through text-sm">{rp(p.price)}</p>}
        <p className="text-sm mt-2 text-silver">Status: {p.stock_status || "tersedia"}</p>
        {p.description && <p className="mt-4 text-sm text-silver whitespace-pre-line">{p.description}</p>}
        {spec.length > 0 && <dl className="mt-5 text-sm grid grid-cols-3 gap-y-2">{spec.map(([k, v]) => <><dt key={k} className="text-gold">{k}</dt><dd key={k + v} className="col-span-2">{v}</dd></>)}</dl>}
        <a href={wa(s.whatsapp, msg)} className="block text-center bg-gold text-ink font-semibold py-3 rounded mt-6">BELI / PESAN VIA WHATSAPP</a>
      </div>
    </div>
  );
}
