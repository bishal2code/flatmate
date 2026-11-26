"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  formatListingType,
  formatPriceNpr,
  type ListingPhoto,
} from "../types";

interface ListingDetail {
  id: string;
  title: string;
  description: string | null;
  listing_type: string;
  location: string;
  price_npr: number;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
}

interface DetailState {
  status: "loading" | "ready" | "missing" | "error";
  listing: ListingDetail | null;
  photos: ListingPhoto[];
  message: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?.replace(/\/(?:rest\/v1|storage\/v1)\/?$/i, "")
  .replace(/\/+$/, "");
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function Icon({ name, className = "" }: { name: "pin" | "person" | "phone" | "mail" | "copy"; className?: string }) {
  const common = {
    className: `h-5 w-5 shrink-0 ${className}`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  if (name === "pin") return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
  if (name === "person") return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 21v-1a7 7 0 0 1 14 0v1" /></svg>;
  if (name === "phone") return <svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
  if (name === "mail") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" /></svg>;
  return <svg {...common}><rect x="8" y="8" width="12" height="12" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
}

export default function ListingDetailPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = use(params);
  const [state, setState] = useState<DetailState>({
    status: "loading",
    listing: null,
    photos: [],
    message: "",
  });
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setState({
        status: "error",
        listing: null,
        photos: [],
        message: "Supabase is not configured. Set the public Supabase URL and anon key to view listings.",
      });
      return;
    }

    const controller = new AbortController();
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    };
    const listingUrl = new URL(`${SUPABASE_URL}/rest/v1/listings`);
    listingUrl.searchParams.set("select", "id,title,description,listing_type,location,price_npr,contact_name,contact_phone,contact_email");
    listingUrl.searchParams.set("id", `eq.${id}`);
    listingUrl.searchParams.set("limit", "1");
    const photosUrl = new URL(`${SUPABASE_URL}/rest/v1/listing_photos`);
    photosUrl.searchParams.set("select", "id,image_url,sort_order");
    photosUrl.searchParams.set("listing_id", `eq.${id}`);
    photosUrl.searchParams.set("order", "sort_order.asc");

    Promise.all([
      fetch(listingUrl, { headers, signal: controller.signal, cache: "no-store" }),
      fetch(photosUrl, { headers, signal: controller.signal, cache: "no-store" }),
    ])
      .then(async ([listingResponse, photosResponse]) => {
        if (!listingResponse.ok || !photosResponse.ok) {
          throw new Error(`Unable to load this listing (HTTP ${!listingResponse.ok ? listingResponse.status : photosResponse.status}).`);
        }
        const [listings, photos] = await Promise.all([
          listingResponse.json() as Promise<ListingDetail[]>,
          photosResponse.json() as Promise<ListingPhoto[]>,
        ]);
        const listing = Array.isArray(listings) ? listings[0] : undefined;
        setState(listing
          ? { status: "ready", listing, photos: Array.isArray(photos) ? photos : [], message: "" }
          : { status: "missing", listing: null, photos: [], message: "This listing may have been removed or the link may be incorrect." });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          listing: null,
          photos: [],
          message: error instanceof Error ? error.message : "Something went wrong while loading this listing.",
        });
      });

    return () => controller.abort();
  }, [id]);

  async function copyPhone(phone: string) {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-9rem)] bg-[#f6f8fb] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/listings" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50">
          <span aria-hidden="true">←</span> Back to listings
        </Link>

        {state.status === "loading" ? (
          <div className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.95fr]" aria-label="Loading listing">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
            <div className="space-y-6"><div className="h-72 animate-pulse rounded-2xl bg-slate-200" /><div className="h-56 animate-pulse rounded-2xl bg-slate-200" /></div>
          </div>
        ) : state.status !== "ready" || !state.listing ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">{state.status === "missing" ? "Listing not found" : "Unable to load listing"}</h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{state.message}</p>
            <Link href="/listings" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800">Browse listings</Link>
          </section>
        ) : (
          <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1.35fr_0.95fr]">
            <section aria-label="Listing photos">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
                {state.photos.length > 0 ? (
                  <img
                    src={state.photos[selectedPhoto]?.image_url}
                    alt={`${state.listing.title}, photo ${selectedPhoto + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="px-6 text-center text-sm text-slate-500">No photos have been added to this listing.</div>
                )}
              </div>
              {state.photos.length > 0 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2" aria-label="Choose a listing photo">
                  {state.photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setSelectedPhoto(index)}
                      aria-label={`Show photo ${index + 1}`}
                      aria-pressed={selectedPhoto === index}
                      className={`h-24 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-28 sm:w-40 ${selectedPhoto === index ? "border-teal-700 ring-2 ring-teal-700/20" : "border-transparent hover:border-slate-300"}`}
                    >
                      <img src={photo.image_url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium capitalize text-teal-800">{formatListingType(state.listing.listing_type)}</span>
                  <p className="text-right text-xl font-bold text-slate-900">{formatPriceNpr(state.listing.price_npr)}<span className="block text-xs font-normal text-slate-500">per month</span></p>
                </div>
                <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{state.listing.title}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Icon name="pin" />{state.listing.location}</p>
                <div className="mt-5 border-t border-slate-200 pt-5">
                  <h2 className="text-base font-semibold text-slate-900">Description</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{state.listing.description?.trim() || "No description has been added yet."}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-slate-950">Contact information</h2>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-600"><Icon name="person" />Owner: <span className="font-medium text-slate-900">{state.listing.contact_name}</span></p>
                {state.listing.contact_phone && (
                  <div className="mt-4 flex min-h-[4.25rem] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                    <a href={`tel:${state.listing.contact_phone}`} className="flex min-w-0 items-center gap-3 font-semibold text-slate-900 hover:text-teal-800">
                      <Icon name="phone" className="text-teal-700" /><span className="truncate">{state.listing.contact_phone}</span>
                    </a>
                    <button type="button" onClick={() => { const phone = state.listing?.contact_phone; if (phone) void copyPhone(phone); }} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100" aria-label="Copy phone number">
                      <Icon name="copy" className="h-4 w-4" />{copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                )}
                {state.listing.contact_email && (
                  <a href={`mailto:${state.listing.contact_email}`} className="mt-4 flex min-w-0 items-center gap-3 break-all text-sm text-slate-600 hover:text-teal-800">
                    <Icon name="mail" />{state.listing.contact_email}
                  </a>
                )}
                {!state.listing.contact_phone && !state.listing.contact_email && <p className="mt-4 text-sm text-slate-600">The owner has not provided contact details.</p>}
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
