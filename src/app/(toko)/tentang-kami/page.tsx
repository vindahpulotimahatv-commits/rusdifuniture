export const metadata = { title: "Tentang Kami | Rusdi Furniture", description: "Rusdi Furniture Custom Bekasi: furniture modern dan custom." };
export default function Tentang() {
  const poin = ["Furniture custom sesuai ukuran, warna, dan material", "Pilihan desain modern untuk berbagai ruangan", "Konsultasi gratis sebelum memesan", "Pengerjaan rapi dengan material pilihan", "Pengiriman ke seluruh Indonesia"];
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-lgold">Tentang Rusdi Furniture</h1>
      <p className="text-silver mt-4 text-sm leading-relaxed">Rusdi Furniture Custom Bekasi menyediakan furniture modern dan custom untuk ruang tamu, kamar tidur, ruang makan, kitchen set, apartemen, hingga kebutuhan kantor. Kami membantu Anda mewujudkan furniture yang sesuai dengan kebutuhan ruangan.</p>
      <ul className="mt-6 space-y-2 text-sm">{poin.map((t) => <li key={t} className="border border-gold/20 rounded-lg px-4 py-3">{t}</li>)}</ul>
    </div>
  );
}
