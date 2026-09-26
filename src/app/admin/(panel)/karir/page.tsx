"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import Toast from "@/components/admin/Toast";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const emptyJob: any = { title: "", slug: "", department: "", location: "", employment_type: "Penuh Waktu", description: "", requirements: "", is_active: true };
const statuses = ["BARU", "DIPROSES", "DITERIMA", "DITOLAK"];
const statusBadge = (s: string) => ({ BARU: "bg-gold text-ink", DIPROSES: "bg-blue-500/20 text-blue-300", DITERIMA: "bg-green-500/20 text-green-300", DITOLAK: "bg-red-500/20 text-red-300" } as any)[s] || "";

export default function Karir() {
  const sb = supabase();
  const [tab, setTab] = useState<"lowongan" | "pelamar">("lowongan");
  const [toast, setToast] = useState("");
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };

  // ----- Lowongan -----
  const [jobs, setJobs] = useState<any[]>([]);
  const [f, setF] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const [ld, setLd] = useState(true);
  const loadJobs = async () => { const { data } = await sb.from("job_openings").select("*").order("created_at", { ascending: false }); setJobs(data || []); setLd(false); };
  const open = (j: any | null) => setF(j ? { ...emptyJob, ...j } : { ...emptyJob });
  const saveJob = async () => {
    if (!f.title) { say("Judul lowongan wajib diisi."); return; }
    setBusy(true);
    try {
      const row = { title: f.title, slug: f.slug || slugify(f.title), department: f.department || null, location: f.location || null, employment_type: f.employment_type, description: f.description || null, requirements: f.requirements || null, is_active: !!f.is_active };
      if (f.id) { const r = await sb.from("job_openings").update(row).eq("id", f.id); if (r.error) throw r.error; }
      else { const r = await sb.from("job_openings").insert(row); if (r.error) throw r.error; }
      say(f.id ? "Lowongan berhasil diperbarui." : "Lowongan berhasil ditambahkan.");
      setF(null); loadJobs();
    } catch (e: any) { say("Gagal menyimpan: " + (e.message || "coba lagi")); }
    setBusy(false);
  };
  const toggleJob = async (j: any) => { await sb.from("job_openings").update({ is_active: !j.is_active }).eq("id", j.id); say(j.is_active ? "Lowongan dinonaktifkan." : "Lowongan diaktifkan."); loadJobs(); };
  const delJob = async (j: any) => { if (!confirm(`Hapus lowongan "${j.title}"? Tindakan ini tidak bisa dibatalkan.`)) return; await sb.from("job_openings").delete().eq("id", j.id); say("Lowongan berhasil dihapus."); loadJobs(); };

  // ----- Pelamar -----
  const [apps, setApps] = useState<any[]>([]);
  const [ldApp, setLdApp] = useState(true);
  const [viewApp, setViewApp] = useState<any | null>(null);
  const loadApps = async () => { const { data } = await sb.from("job_applications").select("*").order("created_at", { ascending: false }); setApps(data || []); setLdApp(false); };
  const chgStatus = async (a: any, status: string) => { await sb.from("job_applications").update({ status }).eq("id", a.id); say("Status pelamar diperbarui."); setViewApp(null); loadApps(); };
  const delApp = async (a: any) => { if (!confirm(`Hapus data lamaran dari "${a.full_name}"?`)) return; await sb.from("job_applications").delete().eq("id", a.id); say("Data lamaran dihapus."); setViewApp(null); loadApps(); };

  useEffect(() => { loadJobs(); loadApps(); }, []);
  const cls = "w-full bg-ink border border-gold/30 rounded px-3 py-2 text-sm";
  const inp = (k: string, label: string) => (<label className="block text-xs text-silver">{label}<input value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={cls + " mt-1"} /></label>);

  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-serif text-2xl text-lgold">Karir</h1>{tab === "lowongan" && <button onClick={() => open(null)} className="bg-gold text-ink font-semibold text-sm px-4 py-2 rounded">+ TAMBAH</button>}</div>
      <Toast msg={toast} />
      <div className="flex gap-2 mt-4 text-sm">
        <button onClick={() => setTab("lowongan")} className={`px-4 py-2 rounded ${tab === "lowongan" ? "bg-gold text-ink font-semibold" : "border border-gold/30 text-silver"}`}>Lowongan</button>
        <button onClick={() => setTab("pelamar")} className={`px-4 py-2 rounded ${tab === "pelamar" ? "bg-gold text-ink font-semibold" : "border border-gold/30 text-silver"}`}>Pelamar {apps.length > 0 && `(${apps.length})`}</button>
      </div>

      {tab === "lowongan" && (
        ld ? <p className="text-silver mt-6">Memuat…</p> : jobs.length === 0 ? <p className="text-silver mt-6">Belum ada lowongan.</p> : (
          <div className="mt-5 space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="bg-charcoal border border-gold/30 rounded-xl p-3">
                <p className="text-sm font-medium">{j.title} {!j.is_active && <span className="text-xs text-silver">(nonaktif)</span>}</p>
                <p className="text-xs text-lgold">{[j.department, j.location, j.employment_type].filter(Boolean).join(" · ")}</p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <button onClick={() => open(j)} className="border border-gold/50 text-gold rounded px-2 py-1">Edit</button>
                  <button onClick={() => toggleJob(j)} className="border border-silver/40 rounded px-2 py-1">{j.is_active ? "Nonaktifkan" : "Aktifkan"}</button>
                  <button onClick={() => delJob(j)} className="border border-red-400/60 text-red-400 rounded px-2 py-1">Hapus</button>
                </div>
              </div>))}
          </div>)
      )}

      {tab === "pelamar" && (
        ldApp ? <p className="text-silver mt-6">Memuat…</p> : apps.length === 0 ? <p className="text-silver mt-6">Belum ada pelamar.</p> : (
          <div className="mt-5 space-y-2">
            {apps.map((a) => (
              <button key={a.id} onClick={() => setViewApp(a)} className="w-full text-left bg-charcoal border border-gold/30 rounded-xl p-3">
                <div className="flex justify-between items-start">
                  <div><p className="text-sm font-medium">{a.full_name}</p><p className="text-xs text-silver">Melamar: {a.job_title || "-"}</p></div>
                  <span className={`text-xs px-2 py-1 rounded ${statusBadge(a.status)}`}>{a.status}</span>
                </div>
              </button>))}
          </div>)
      )}

      {f && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto">
          <div className="max-w-2xl mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center"><h2 className="font-serif text-xl text-lgold">{f.id ? "Edit Lowongan" : "Tambah Lowongan"}</h2><button onClick={() => setF(null)} className="text-silver text-2xl">×</button></div>
            {inp("title", "Judul Lowongan")}
            {inp("slug", "Slug (kosongkan agar otomatis)")}
            <div className="grid grid-cols-2 gap-3">{inp("department", "Departemen")}{inp("location", "Lokasi")}</div>
            <label className="block text-xs text-silver">Tipe Pekerjaan<select value={f.employment_type} onChange={(e) => setF({ ...f, employment_type: e.target.value })} className={cls + " mt-1"}><option>Penuh Waktu</option><option>Paruh Waktu</option><option>Kontrak</option><option>Magang</option></select></label>
            <label className="block text-xs text-silver">Deskripsi Pekerjaan<textarea rows={4} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} className={cls + " mt-1"} /></label>
            <label className="block text-xs text-silver">Kualifikasi / Syarat<textarea rows={4} value={f.requirements ?? ""} onChange={(e) => setF({ ...f, requirements: e.target.value })} className={cls + " mt-1"} /></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} /> Tampilkan di website (aktif)</label>
            <button disabled={busy} onClick={saveJob} className="w-full bg-gold text-ink font-semibold py-3 rounded">{busy ? "MENYIMPAN…" : "SIMPAN"}</button>
          </div></div>)}

      {viewApp && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto">
          <div className="max-w-lg mx-auto bg-charcoal min-h-full md:my-6 md:rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center"><h2 className="font-serif text-xl text-lgold">{viewApp.full_name}</h2><button onClick={() => setViewApp(null)} className="text-silver text-2xl">×</button></div>
            <div className="text-sm space-y-1 text-silver">
              <p>Melamar posisi: {viewApp.job_title || "-"}</p>
              {viewApp.email && <p>Email: {viewApp.email}</p>}
              {viewApp.phone && <p>WhatsApp/Telepon: {viewApp.phone}</p>}
              <p>Tanggal melamar: {new Date(viewApp.created_at).toLocaleString("id-ID")}</p>
            </div>
            {viewApp.cover_letter && <div className="text-sm border-t border-gold/20 pt-2"><p className="text-gold text-xs mb-1">Pesan / Motivasi</p><p className="whitespace-pre-line">{viewApp.cover_letter}</p></div>}
            {viewApp.cv_url && <a href={viewApp.cv_url} target="_blank" className="block text-center border border-gold text-gold py-2 rounded text-sm">LIHAT / UNDUH CV</a>}
            <label className="block text-xs text-silver">Ubah Status<select value={viewApp.status} onChange={(e) => chgStatus(viewApp, e.target.value)} className={cls + " mt-1"}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
            <button onClick={() => delApp(viewApp)} className="w-full border border-red-400/60 text-red-400 rounded py-2 text-sm">Hapus Data Lamaran</button>
          </div></div>)}
    </div>
  );
}
