import { supabase } from "./supabase-browser";
async function shrink(f: File): Promise<Blob> {
  const img = await createImageBitmap(f);
  const s = Math.min(1, 1400 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return new Promise((r) => c.toBlob((b) => r(b!), "image/jpeg", 0.82));
}
export async function uploadImage(f: File, folder: string) {
  const b = await shrink(f);
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const sb = supabase();
  const { error } = await sb.storage.from("images").upload(path, b, { contentType: "image/jpeg" });
  if (error) throw error;
  return sb.storage.from("images").getPublicUrl(path).data.publicUrl;
}
