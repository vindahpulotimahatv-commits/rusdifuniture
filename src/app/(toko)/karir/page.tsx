import Link from "next/link";
import { db } from "@/lib/db";
export const metadata = { title: "Karir | Rusdi Furniture", description: "Lowongan pekerjaan di Rusdi Furniture Custom Bekasi." };
export const dynamic = "force-dynamic";
export default async function Karir() {
  const { data } = await db().from("job_openings").select("*").eq("is_active", true).order("created_at", { ascending: false });
  const jobs = data || [];
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-lgold">Karir di Rusdi Furniture</h1>
      <p className="text-silver mt-2 text-sm">Bergabunglah bersama kami dan jadi bagian dari tim Rusdi Furniture Custom Bekasi.</p>
      {jobs.length === 0 ? (
        <p className="text-silver mt-8">Belum ada lowongan yang dibuka saat ini. Silakan cek kembali di lain waktu.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {jobs.map((j: any) => (
            <Link key={j.id} href={`/karir/${j.slug}`} className="block bg-charcoal border border-gold/30 rounded-xl p-4 hover:border-gold transition">
              <p className="font-serif text-lg text-cream">{j.title}</p>
              <p className="text-xs text-gold mt-1">{[j.department, j.location, j.employment_type].filter(Boolean).join(" · ")}</p>
              {j.description && <p className="text-sm text-silver mt-2 line-clamp-2">{j.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
