"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
export default function CartLink() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const u = () => setN(getCart().reduce((a, i) => a + i.qty, 0));
    u(); window.addEventListener("cart", u); return () => window.removeEventListener("cart", u);
  }, []);
  return <Link href="/keranjang" className="text-sm border border-gold/50 text-gold rounded px-3 py-1.5">Keranjang{n > 0 ? ` (${n})` : ""}</Link>;
}
