"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Requirement {
  id: string;
  title: string;
  description: string | null;
  location: string;
  budget_npr: number;
  occupation_type: string;
  smoking_allowed: boolean;
  drinking_allowed: boolean;
  max_occupants: number;
  contact_name: string;
  contact_phone: string | null;
  contact_email: string | null;
}

type ListState = {
  status: "loading" | "ready" | "error";
  requirements: Requirement[];
  message: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?.replace(/\/(?:rest\/v1|storage\/v1)\/?$/i, "")
  .replace(/\/+$/, "");
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function formatOccupation(value: string) {
  if (value === "working_professional") return "Working professional";
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatBudget(value: number) {
  return `Rs ${new Intl.NumberFormat("en-IN").format(value)}`;
}

export default function FlatmatesPage() {
  const [state, setState] = useState<ListState>({
    status: "loading",
    requirements: [],
    message: "",
  });

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setState({
        status: "error",
        requirements: [],
        message: "Supabase is not configured. Set the public Supabase URL and anon key to view requirements.",
      });
      return;
    }

    const controller = new AbortController();
    const url = new URL(`${SUPABASE_URL}/rest/v1/flatmate_requirements`);
    url.searchParams.set(
      "select",
      "id,title,description,location,budget_npr,occupation_type,smoking_allowed,drinking_allowed,max_occupants,contact_name,contact_phone,contact_email",
    );
    url.searchParams.set("order", "created_at.desc");

    fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(
            body?.message ?? `Unable to load flatmate requirements (HTTP ${response.status}).`,
          );
        }
        const data = (await response.json()) as Requirement[];
        setState({
          status: "ready",
          requirements: Array.isArray(data) ? data : [],
          message: "",
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          requirements: [],
          message: error instanceof Error ? error.message : "Something went wrong while loading requirements.",
        });
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-7 sm:px-6 sm:py-9">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Flatmates</h1>
            <p className="mt-1 text-sm text-slate-500">
              {state.status === "loading"
                ? "Loading flatmate requirements…"
                : state.status === "ready"
                  ? `Flatmate requirements · ${state.requirements.length} ${state.requirements.length === 1 ? "profile" : "profiles"}`
                  : "Find people looking for a flatmate in Pokhara."}
            </p>
          </div>
          <Link href="/flatmates/new" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 sm:self-auto">
            <span aria-hidden="true">+</span> Post requirement
          </Link>
        </header>

        {state.status === "loading" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading flatmate requirements">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : state.status === "error" ? (
          <section role="alert" className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-800 shadow-sm">
            <h2 className="font-semibold">Unable to load flatmates</h2>
            <p className="mt-2">{state.message}</p>
          </section>
        ) : state.requirements.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">No flatmate requirements yet</h2>
            <p className="mt-2 text-sm text-slate-500">Be the first to share what you are looking for.</p>
            <Link href="/flatmates/new" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800">Post a requirement</Link>
          </section>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {state.requirements.map((requirement) => (
              <article key={requirement.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/flatmates/${encodeURIComponent(requirement.id)}`} className="min-w-0 text-base font-semibold text-slate-900 hover:text-teal-800">
                      {requirement.contact_name || requirement.title}
                    </Link>
                    <span className="shrink-0 rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800">
                      {formatOccupation(requirement.occupation_type)}
                    </span>
                  </div>
                  <Link href={`/flatmates/${encodeURIComponent(requirement.id)}`} className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-800">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    {requirement.location}
                  </Link>
                  <p className="mt-5 min-h-10 text-sm leading-5 text-slate-600">
                    {requirement.description?.trim() || "No additional note provided."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-700">
                    <span className="rounded-md bg-slate-100 px-2 py-1">Smoking: {requirement.smoking_allowed ? "Yes" : "No"}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-1">Drinking: {requirement.drinking_allowed ? "Yes" : "No"}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-1">Max occupants: {requirement.max_occupants}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-1">Budget: {formatBudget(requirement.budget_npr)}</span>
                  </div>
                </div>
                <div className="border-t border-slate-100 p-4">
                  {requirement.contact_phone ? (
                    <a href={`tel:${requirement.contact_phone}`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
                      Contact
                    </a>
                  ) : (
                    <Link href={`/flatmates/${encodeURIComponent(requirement.id)}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800">View contact details</Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
