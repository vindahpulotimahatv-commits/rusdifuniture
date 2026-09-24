"use client";
import {useState} from "react";import {supabase} from "@/lib/supabase-browser";
export default function Login(){
 const [email,setE]=useState("");const [pw,setP]=useState("");const [err,setErr]=useState("");const [ld,setL]=useState(false);
 async function go(e:React.FormEvent){e.preventDefault();setL(true);setErr("");
  const {error}=await supabase().auth.signInWithPassword({email,password:pw});
  if(error){setErr("Email atau password salah.");setL(false);return}
  location.href="/admin/dashboard";}
 return <main className="min-h-screen grid place-items-center p-4 bg-ink"><form onSubmit={go} className="w-full max-w-sm bg-charcoal border border-gold/40 rounded-xl p-6 space-y-4">
  <img src="/logo.jpeg" alt="Rusdi Furniture" className="w-48 mx-auto"/>
  <input required type="email" placeholder="Email" value={email} onChange={e=>setE(e.target.value)} className="w-full p-3 rounded bg-ink border border-silver/30"/>
  <input required type="password" placeholder="Password" value={pw} onChange={e=>setP(e.target.value)} className="w-full p-3 rounded bg-ink border border-silver/30"/>
  {err&&<p className="text-red-400 text-sm">{err}</p>}
  <button disabled={ld} className="w-full p-3 rounded bg-gold text-ink font-semibold tracking-wide">{ld?"MEMPROSES...":"LOGIN"}</button></form></main>}
