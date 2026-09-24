import { getSettings, wa } from "@/lib/db";
export const metadata = { title: "Kontak | Rusdi Furniture" };
export const revalidate = 30;
export default async function Kontak() {
  const s = await getSettings();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <h1 className="font-serif text-3xl text-lgold">Kontak</h1>
      <p className="mt-2 tracking-widest text-gold text-sm">RUSDI FURNITURE · CUSTOM BEKASI</p>
      <div className="mt-8 space-y-2 text-silver text-sm">
        <p>WhatsApp: +62 812-9106-4259</p>
        {s.address && <p>Alamat: {s.address}</p>}
        {s.hours && <p>Jam operasional: {s.hours}</p>}
        {s.instagram && <p>Instagram: {s.instagram}</p>}
      </div>
      <a href={wa(s.whatsapp, "Halo Rusdi Furniture, saya ingin bertanya.")} className="inline-block mt-8 bg-gold text-ink font-semibold px-8 py-3 rounded">HUBUNGI VIA WHATSAPP</a>
    </div>
  );
}
