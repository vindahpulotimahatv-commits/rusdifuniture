import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import KarirApply from "@/components/KarirApply";
export const dynamic = "force-dynamic";
async function load(slug: string) {
  const { data } = await db().from("job_openings").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  return data;
}
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const j = await load(params.slug);
  return { title: j ? `${j.title} | Karir Rusdi Furniture` : "Lowongan" };
}
export default async function KarirDetail({ params }: { params: { slug: string } }) {
  const j: any = await load(params.slug);
  if (!j) notFound();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-serif text-2xl md:text-3xl text-lgold">{j.title}</h1>
      <p className="text-xs text-gold mt-2 tracking-wide">{[j.department, j.location, j.employment_type].filter(Boolean).join(" · ")}</p>
      {j.description && (
        <div className="mt-6">
          <p className="text-sm text-gold mb-1">Deskripsi Pekerjaan</p>
          <p className="text-sm text-silver whitespace-pre-line">{j.description}</p>
        </div>
      )}
      {j.requirements && (
        <div className="mt-5">
          <p className="text-sm text-gold mb-1">Kualifikasi / Syarat</p>
          <p className="text-sm text-silver whitespace-pre-line">{j.requirements}</p>
        </div>
      )}
      <KarirApply jobId={j.id} jobTitle={j.title} />
    </div>
  );
}
