export type Item = { id: string; name: string; price: number; image: string | null; slug: string; qty: number };
const K = "rf_cart";
export const fmt = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");
export const getCart = (): Item[] => { try { return JSON.parse(localStorage.getItem(K) || "[]"); } catch { return []; } };
export const saveCart = (c: Item[]) => { localStorage.setItem(K, JSON.stringify(c)); window.dispatchEvent(new Event("cart")); };
export const addItem = (i: Omit<Item, "qty">, qty: number) => {
  const c = getCart(); const f = c.find((x) => x.id === i.id);
  if (f) f.qty += qty; else c.push({ ...i, qty });
  saveCart(c);
};
export const total = (c: Item[]) => c.reduce((a, i) => a + i.price * i.qty, 0);
export const cartText = (c: Item[]) => c.map((i, n) => `${n + 1}. ${i.name} x${i.qty} = ${fmt(i.price * i.qty)}`).join("\n");
