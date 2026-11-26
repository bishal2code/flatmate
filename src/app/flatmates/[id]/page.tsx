"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

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

type DetailState = {
  status: "loading" | "ready" | "missing" | "error";
  requirement: Requirement | null;
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

export default function FlatmateRequirementDetailPage({
  params,
}: PageProps<"/flatmates/[id]">) {
  const { id } = use(params);
  const [state, setState] = useState<DetailState>({
    status: "loading",
    requirement: null,
    message: "",
  });

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setState({
        status: "error",
        requirement: null,
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
    url.searchParams.set("id", `eq.${id}`);
    url.searchParams.set("limit", "1");

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
            body?.message ?? `Unable to load this requirement (HTTP ${response.status}).`,
          );
        }
        const data = (await response.json()) as Requirement[];
        const requirement = Array.isArray(data) ? data[0] : undefined;
        setState(
          requirement
            ? { status: "ready", requirement, message: "" }
            : {
                status: "missing",
                requirement: null,
                message: "This requirement may have been removed or the link may be incorrect.",
              },
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          requirement: null,
          message: error instanceof Error ? error.message : "Something went wrong while loading this requirement.",
        });
      });

    return () => controller.abort();
  }, [id]);

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-7 sm:px-6 sm:py-9">
      <div className="mx-auto max-w-3xl">
        <Link href="/flatmates" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
          <span aria-hidden="true">←</span> Back to flatmates
        </Link>

        {state.status === "loading" ? (
          <div className="mt-6 h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" aria-label="Loading flatmate requirement" />
        ) : state.status !== "ready" || !state.requirement ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">
              {state.status === "missing" ? "Requirement not found" : "Unable to load requirement"}
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{state.message}</p>
            <Link href="/flatmates" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800">Browse flatmates</Link>
          </section>
        ) : (
          <article className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950">{state.requirement.contact_name || state.requirement.title}</h1>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    {state.requirement.location}
                  </p>
                </div>
                <span className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-sm font-medium text-teal-800">
                  {formatOccupation(state.requirement.occupation_type)}
                </span>
              </div>

              <section className="mt-7 border-t border-slate-100 pt-6">
                <h2 className="text-base font-semibold text-slate-900">About this requirement</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {state.requirement.description?.trim() || "No additional note provided."}
                </p>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Maximum occupants</dt><dd className="mt-1 text-sm font-medium text-slate-900">{state.requirement.max_occupants}</dd></div>
                  <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Monthly budget</dt><dd className="mt-1 text-sm font-medium text-slate-900">{formatBudget(state.requirement.budget_npr)}</dd></div>
                  <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Smoking</dt><dd className="mt-1 text-sm font-medium text-slate-900">{state.requirement.smoking_allowed ? "Allowed" : "Not allowed"}</dd></div>
                  <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs text-slate-500">Drinking</dt><dd className="mt-1 text-sm font-medium text-slate-900">{state.requirement.drinking_allowed ? "Allowed" : "Not allowed"}</dd></div>
                </dl>
              </section>

              <section className="mt-7 border-t border-slate-100 pt-6">
                <h2 className="text-base font-semibold text-slate-900">Contact {state.requirement.contact_name}</h2>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  {state.requirement.contact_phone && (
                    <a href={`tel:${state.requirement.contact_phone}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
                      Call {state.requirement.contact_phone}
                    </a>
                  )}
                  {state.requirement.contact_email && (
                    <a href={`mailto:${state.requirement.contact_email}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      Email {state.requirement.contact_email}
                    </a>
                  )}
                  {!state.requirement.contact_phone && !state.requirement.contact_email && (
                    <p className="text-sm text-slate-600">No contact details have been provided.</p>
                  )}
                </div>
              </section>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
