"use client";
export default function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-gold text-ink text-sm font-medium px-4 py-2 rounded shadow">{msg}</div>;
}
