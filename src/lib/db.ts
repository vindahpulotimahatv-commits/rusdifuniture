import { createClient } from "@supabase/supabase-js";
export const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export const rp = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");
export const wa = (num: string, text: string) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
export async function getSettings() {
  const { data } = await db().from("settings").select("key,value");
  const s: Record<string, string> = { whatsapp: "6281291064259" };
  (data || []).forEach((r: any) => { s[r.key] = r.value; });
  return s;
}
