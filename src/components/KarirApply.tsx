"use client";
import { useState } from "react";
import { db } from "@/lib/db";
import { uploadDoc } from "@/lib/upload";

export default function KarirApply({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [f, setF] = useState({ nama: "", email: "", hp: "", pesan: "" });
  const [cv, setCv] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const inp = "w-full bg-ink border border-gold/30 rounded px-3 py-3 text-sm";

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    if (!f.nama) return;
    setBusy(true); setErr("");
    try {
      let cvUrl: string | null = null;
      if (cv) cvUrl = await uploadDoc(cv, "cv-pelamar");
      const r = await db().from("job_applications").insert({ job_id: jobId, job_title: jobTitle, full_name: f.nama, email: f.email || null, phone: f.hp || null, cover_letter: f.pesan || null, cv_url: cvUrl });
      if (r.error) throw r.error;
      setDone(true);
    } catch (e: any) {
      setErr("Gagal mengirim lamaran. Coba lagi. (" + (e.message || "") + ")");
    }
    setBusy(false);
  }

  if (done) return <div className="mt-8 bg-charcoal border border-gold/30 rounded-xl p-5 text-center"><p className="text-lgold font-medium">Lamaran kamu sudah kami terima.</p><p className="text-silver text-sm mt-1">Tim kami akan menghubungi lewat email/WhatsApp jika kamu lolos ke tahap selanjutnya.</p></div>;

  return (
    <form onSubmit={kirim} className="mt-8 space-y-3">
      <h2 className="font-serif text-xl text-lgold">Lamar Posisi Ini</h2>
      <input required placeholder="Nama Lengkap" className={inp} value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} />
      <input type="email" placeholder="Email" className={inp} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input placeholder="Nomor WhatsApp" inputMode="tel" className={inp} value={f.hp} onChange={(e) => setF({ ...f, hp: e.target.value })} />
      <textarea placeholder="Ceritakan singkat tentang dirimu / motivasi melamar (opsional)" rows={4} className={inp} value={f.pesan} onChange={(e) => setF({ ...f, pesan: e.target.value })} />
      <label className="block text-xs text-silver">Unggah CV (PDF/DOC, opsional)
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files?.[0] || null)} className="block mt-1 text-sm" />
      </label>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <button disabled={busy} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENGIRIM…" : "KIRIM LAMARAN"}</button>
    </form>
  );
}
