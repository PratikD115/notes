"use client";

import { FormEvent, useEffect, useState } from "react";
import { FilePlus2, Loader2, NotebookPen, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Note = { id: number; title: string; text: string; createdAt: string };

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function readResponse(response: Response) {
    const text = await response.text();
    try { return JSON.parse(text); } catch { return { message: text || "Unexpected server response" }; }
  }

  async function loadNotes() {
    const response = await fetch("/api/notes");
    const result = await readResponse(response);
    if (response.ok) setNotes(result.data);
    else setError(result.message ?? "Please log in");
    setIsLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotes();
  }, []);

  async function createNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setIsSaving(true);
    setError("");
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.get("title"), text: form.get("text") }),
    });
    const result = await readResponse(response);
    setIsSaving(false);
    if (!response.ok) {
      setError(result.message ?? "Failed to create note");
      return;
    }
    formElement.reset();
    await loadNotes();
  }

  return <main className="mx-auto w-full max-w-6xl space-y-8 px-5 py-9 sm:px-8 lg:px-10">
    <section className="relative overflow-hidden rounded-3xl border bg-white px-6 py-8 shadow-sm shadow-emerald-950/[0.03] sm:px-9 sm:py-10">
      <div className="pointer-events-none absolute -right-10 -top-24 size-72 rounded-full bg-emerald-100/70 blur-3xl" />
      <div className="relative max-w-2xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"><Sparkles className="size-3.5" /> Your personal space</div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">A place for your thoughts.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">Capture the little things, make sense of the big things, and keep it all close at hand.</p>
      </div>
    </section>

    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Your collection</p><h2 className="mt-1 text-xl font-semibold tracking-tight">Recent notes</h2></div><span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-border">{notes.length} {notes.length === 1 ? "note" : "notes"}</span></div>
        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {isLoading ? <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">Loading your notes…</div> : notes.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed bg-white/70 px-6 text-center"><div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><NotebookPen className="size-5" /></div><h3 className="font-semibold text-slate-800">Your page is still blank</h3><p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">Start with a thought, reminder, or idea. Your first note can be anything.</p></div> : <div className="grid gap-4 sm:grid-cols-2">{notes.map((note, index) => <article key={note.id} className="group rounded-2xl border bg-white p-5 shadow-sm shadow-slate-900/[0.025] transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"><div className="mb-4 flex items-center justify-between"><span className={`flex size-9 items-center justify-center rounded-xl ${index % 3 === 0 ? "bg-emerald-50 text-emerald-700" : index % 3 === 1 ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}><NotebookPen className="size-4" /></span><time className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</time></div><h3 className="font-semibold tracking-tight text-slate-800">{note.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-500">{note.text}</p></article>)}</div>}
      </div>

      <form onSubmit={createNote} className="rounded-2xl border bg-white p-5 shadow-sm shadow-slate-900/[0.025] lg:sticky lg:top-20">
        <div className="mb-5 flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><FilePlus2 className="size-5" /></div><div><h2 className="font-semibold tracking-tight">Create a note</h2><p className="mt-1 text-xs leading-5 text-slate-500">Save a thought before it slips away.</p></div></div>
        <label className="mb-4 block text-xs font-medium text-slate-600">Title<Input name="title" placeholder="Give it a name" required className="mt-1.5 h-10 rounded-xl border-slate-200 bg-slate-50/60 px-3 focus-visible:bg-white" /></label>
        <label className="block text-xs font-medium text-slate-600">Your note<textarea name="text" className="mt-1.5 min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm leading-6 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-3 focus:ring-emerald-500/10" placeholder="Write whatever is on your mind…" required /></label>
        <Button type="submit" disabled={isSaving} className="mt-4 h-10 w-full rounded-xl shadow-sm"><span>{isSaving ? <Loader2 className="animate-spin" /> : <Plus />}</span>{isSaving ? "Saving note…" : "Save note"}</Button>
      </form>
    </section>
  </main>;
}
