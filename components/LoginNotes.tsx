"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, AtSign, LockKeyhole, NotebookPen, Sparkles } from "lucide-react";

export default function LoginNotes() {
  const [email, setEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function readResponse(response: Response) {
    const text = await response.text();
    try { return JSON.parse(text); } catch { return { message: text || "Unexpected server response" }; }
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const result = await readResponse(response);
    if (!result.exists) setRegistering(true);
    else router.push("/notes");
  }

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name: form.get("name"), age: Number(form.get("age")) }) });
    const result = await readResponse(response);
    if (response.ok) router.push("/notes");
    else setMessage(result.message);
  }

  return <section className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_100px_-35px_rgba(15,80,55,0.28)] md:grid-cols-[0.95fr_1.05fr]">
    <div className="relative hidden min-h-[520px] flex-col justify-between overflow-hidden bg-emerald-800 p-10 text-white md:flex">
      <div className="absolute -right-28 -top-24 size-80 rounded-full border-[45px] border-white/5" /><div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-emerald-600/40 blur-3xl" />
      <div className="relative flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-white/15"><NotebookPen className="size-5" /></span><span className="font-semibold tracking-tight">Notely</span></div>
      <div className="relative"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-emerald-50"><Sparkles className="size-3.5" /> A calmer place to think</div><h1 className="max-w-sm text-4xl font-semibold leading-tight tracking-tight">Make room for what matters.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-emerald-50/80">Keep your ideas, reminders, and little sparks of inspiration all in one place.</p></div>
      <p className="relative text-xs text-emerald-100/60">Your thoughts are yours to keep.</p>
    </div>
    <div className="flex min-h-[520px] flex-col justify-center p-7 sm:p-10">
      <div className="mb-8 md:hidden"><span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800"><NotebookPen className="size-5" /></span></div>
      <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Welcome to Notely</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{registering ? "Create your account" : "Let’s get you in"}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{registering ? "A couple of details and your notes are ready." : "Enter your email to continue to your personal notes."}</p></div>
      {!registering ? <form onSubmit={submitLogin} className="space-y-4"><label className="block text-sm font-medium text-slate-700">Email address<span className="relative mt-1.5 block"><AtSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="h-11 rounded-xl border-slate-200 bg-slate-50/60 pl-10 focus-visible:bg-white" /></span></label><Button type="submit" className="h-11 w-full rounded-xl">Continue <ArrowRight /></Button></form> : <form onSubmit={createAccount} className="space-y-4"><label className="block text-sm font-medium text-slate-700">Your name<Input name="name" placeholder="Name" required className="mt-1.5 h-11 rounded-xl bg-slate-50/60" /></label><label className="block text-sm font-medium text-slate-700">Age<Input name="age" type="number" min="0" placeholder="Age" required className="mt-1.5 h-11 rounded-xl bg-slate-50/60" /></label><Button type="submit" className="h-11 w-full rounded-xl">Create account <ArrowRight /></Button></form>}
      {message && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
      <p className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400"><LockKeyhole className="size-3.5" /> Simple email sign-in for your learning workspace</p>
    </div>
  </section>;
}
