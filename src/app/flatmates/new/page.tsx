"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

type RequirementForm = {
  contact_name: string;
  location: string;
  occupation_type: string;
  max_occupants: string;
  budget_npr: string;
  smoking_allowed: boolean;
  drinking_allowed: boolean;
  contact_phone: string;
  contact_email: string;
  description: string;
};

const initialForm: RequirementForm = {
  contact_name: "",
  location: "",
  occupation_type: "student",
  max_occupants: "",
  budget_npr: "",
  smoking_allowed: false,
  drinking_allowed: false,
  contact_phone: "",
  contact_email: "",
  description: "",
};

const inputClass =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10";
const labelClass = "block text-sm font-medium text-slate-800";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    ?.replace(/\/(?:rest\/v1|storage\/v1)\/?$/i, "")
    .replace(/\/+$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url, key };
}

async function readError(response: Response) {
  const body = await response.json().catch(() => null);
  return body?.message ?? body?.error_description ?? body?.error ?? response.statusText;
}

export default function NewFlatmateRequirementPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { url, key } = getSupabaseConfig();
      const response = await fetch(`${url}/rest/v1/flatmate_requirements`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          title: "Looking for a flatmate",
          description: form.description.trim() || null,
          location: form.location,
          budget_npr: Number(form.budget_npr),
          occupation_type: form.occupation_type,
          smoking_allowed: form.smoking_allowed,
          drinking_allowed: form.drinking_allowed,
          max_occupants: Number(form.max_occupants),
          contact_name: form.contact_name.trim(),
          contact_phone: form.contact_phone.trim(),
          contact_email: form.contact_email.trim() || null,
        }),
      });

      if (!response.ok) throw new Error(await readError(response));
      setPublished(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while publishing.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/flatmates"
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span aria-hidden="true">←</span> Back to flatmates
        </Link>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
          <header className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Post a flatmate requirement
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Share your preferences to connect with compatible flatmates in Pokhara.
            </p>
          </header>

          {published ? (
            <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-950">
              <p className="font-semibold">Your flatmate requirement is published.</p>
              <Link className="mt-3 inline-block font-medium underline underline-offset-4" href="/flatmates">
                Back to flatmates
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Name <span className="text-rose-600">*</span>
                  <input className={inputClass} name="contact_name" value={form.contact_name} onChange={(event) => setForm({ ...form, contact_name: event.target.value })} placeholder="Person name" autoComplete="name" required />
                </label>
                <label className={labelClass}>
                  Preferred location <span className="text-rose-600">*</span>
                  <input className={inputClass} name="location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Lakeside, Pokhara" required />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className={labelClass}>
                  Role <span className="text-rose-600">*</span>
                  <select className={inputClass} name="occupation_type" value={form.occupation_type} onChange={(event) => setForm({ ...form, occupation_type: event.target.value })} required>
                    <option value="student">Student</option>
                    <option value="working_professional">Working professional</option>
                  </select>
                </label>
                <label className={labelClass}>
                  Maximum occupants <span className="text-rose-600">*</span>
                  <input className={inputClass} name="max_occupants" type="number" min="1" step="1" value={form.max_occupants} onChange={(event) => setForm({ ...form, max_occupants: event.target.value })} placeholder="e.g. 2" required />
                </label>
                <label className={labelClass}>
                  Budget (NPR) <span className="text-rose-600">*</span>
                  <input className={inputClass} name="budget_npr" type="number" min="0" step="1" value={form.budget_npr} onChange={(event) => setForm({ ...form, budget_npr: event.target.value })} placeholder="e.g. 10000" required />
                </label>
              </div>

              <fieldset className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <legend className="px-1 text-sm font-medium text-slate-800">Lifestyle preferences</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex min-h-10 items-center gap-3 text-sm text-slate-700">
                    <input className="h-5 w-5 accent-teal-700" type="checkbox" name="smoking_allowed" checked={form.smoking_allowed} onChange={(event) => setForm({ ...form, smoking_allowed: event.target.checked })} />
                    Smoking allowed
                  </label>
                  <label className="flex min-h-10 items-center gap-3 text-sm text-slate-700">
                    <input className="h-5 w-5 accent-teal-700" type="checkbox" name="drinking_allowed" checked={form.drinking_allowed} onChange={(event) => setForm({ ...form, drinking_allowed: event.target.checked })} />
                    Drinking allowed
                  </label>
                </div>
              </fieldset>

              <label className={labelClass}>
                Contact phone <span className="text-rose-600">*</span>
                <input className={inputClass} name="contact_phone" type="tel" value={form.contact_phone} onChange={(event) => setForm({ ...form, contact_phone: event.target.value })} placeholder="98XXXXXXXX" autoComplete="tel" required />
              </label>

              <label className={labelClass}>
                Contact email <span className="font-normal text-slate-400">(optional)</span>
                <input className={inputClass} name="contact_email" type="email" value={form.contact_email} onChange={(event) => setForm({ ...form, contact_email: event.target.value })} placeholder="you@example.com" autoComplete="email" />
              </label>

              <label className={labelClass}>
                Additional note <span className="font-normal text-slate-400">(optional)</span>
                <textarea className={`${inputClass} min-h-28 resize-y`} name="description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Short flatmate requirement note..." rows={4} />
              </label>

              {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Link href="/flatmates" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</Link>
                <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? "Publishing…" : "Publish"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
