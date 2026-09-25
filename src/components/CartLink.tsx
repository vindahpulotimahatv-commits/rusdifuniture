"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { getCart } from "@/lib/cart";
export default function CartLink() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const u = () => setN(getCart().reduce((a, i) => a + i.qty, 0));
    u(); window.addEventListener("cart", u); return () => window.removeEventListener("cart", u);
  }, []);
  return (
    <Link href="/keranjang" aria-label="Keranjang" className="relative w-9 h-9 rounded-full border border-gold/30 text-gold grid place-items-center hover:border-gold">
      <ShoppingCart size={16} />
      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-ink text-[10px] font-semibold grid place-items-center">{n}</span>
    </Link>
  );
}
