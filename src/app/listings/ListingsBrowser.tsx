"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ListingCard from "./ListingCard";
import ListingsSkeletonGrid from "./ListingsSkeletonGrid";
import { filterMockListings, MOCK_LISTINGS } from "./mockListings";
import {
  buildListingsQueryUrl,
  DEFAULT_FILTERS,
  LISTING_TYPE_OPTIONS,
  PRICE_RANGE_OPTIONS,
  type Listing,
  type ListingFilters,
  type PriceRangeValue,
} from "./types";

interface FetchResultState {
  key: string;
  listings: Listing[];
  error: string | null;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function ListingsBrowser() {
  const searchParams = useSearchParams();
  const initialMock = searchParams.get("mock") === "1";

  const [useMockData, setUseMockData] = useState(initialMock);
  const [filters, setFilters] = useState<ListingFilters>(DEFAULT_FILTERS);
  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [reloadNonce, setReloadNonce] = useState(0);
  const [resultState, setResultState] = useState<FetchResultState>({
    key: "",
    listings: [],
    error: null,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedLocation(filters.location);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [filters.location]);

  const missingEnv = !useMockData && (!SUPABASE_URL || !SUPABASE_ANON_KEY);
  const currentQueryKey = JSON.stringify({
    useMockData,
    location: debouncedLocation,
    priceRange: filters.priceRange,
    listingType: filters.listingType,
    reloadNonce,
  });

  const hasActiveFilters =
    filters.location.trim() !== "" ||
    filters.priceRange !== "all" ||
    filters.listingType !== "all";

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedLocation("");
  }, []);

  useEffect(() => {
    if (useMockData) {
      return;
    }
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return;
    }

    const controller = new AbortController();
    const url = buildListingsQueryUrl(SUPABASE_URL, {
      location: debouncedLocation,
      priceRange: filters.priceRange,
      listingType: filters.listingType,
    });

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
          throw new Error(`Failed to fetch listings (HTTP ${response.status}).`);
        }
        const data = (await response.json()) as Listing[];
        setResultState({
          key: currentQueryKey,
          listings: Array.isArray(data) ? data : [],
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setResultState({
          key: currentQueryKey,
          listings: [],
          error:
            err instanceof Error
              ? err.message
              : "Something went wrong while loading listings.",
        });
      });

    return () => {
      controller.abort();
    };
  }, [
    useMockData,
    currentQueryKey,
    debouncedLocation,
    filters.priceRange,
    filters.listingType,
  ]);

  const isLoading =
    !useMockData && !missingEnv && resultState.key !== currentQueryKey;
  const errorMessage = useMockData
    ? null
    : missingEnv
      ? "Supabase environment variables are missing. Please check .env.local."
      : resultState.key === currentQueryKey
        ? resultState.error
        : null;
  const listings = useMockData
    ? filterMockListings(MOCK_LISTINGS, {
        location: debouncedLocation,
        priceRange: filters.priceRange,
        listingType: filters.listingType,
      })
    : resultState.key === currentQueryKey
      ? resultState.listings
      : [];

  const countLabel = isLoading
    ? "Loading listings..."
    : errorMessage
      ? "Unable to load listings"
      : `${listings.length} ${listings.length === 1 ? "listing" : "listings"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Rooms &amp; Flats
            </h1>
            {useMockData && (
              <span className="rounded-full bg-[#e8f5f2] px-2.5 py-0.5 text-xs font-semibold text-[#0d7369]">
                Sample data
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Pokhara room &amp; flat listings · {countLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setUseMockData((prev) => !prev)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            {useMockData ? "Use live data" : "Preview sample data"}
          </button>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d7369] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#0a5c54]"
          >
            <span aria-hidden="true">+</span> Post listing
          </Link>
        </div>
      </div>

      <section
        aria-label="Search and filter listings"
        className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="listing-location-search"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Location
            </label>
            <input
              id="listing-location-search"
              type="search"
              value={filters.location}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  location: event.target.value,
                }))
              }
              placeholder="Search area (e.g. Lakeside, Bagar)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0d7369] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d7369]/15"
            />
          </div>

          <div>
            <label
              htmlFor="listing-price-filter"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Monthly Rent
            </label>
            <select
              id="listing-price-filter"
              value={filters.priceRange}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: event.target.value as PriceRangeValue,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 focus:border-[#0d7369] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d7369]/15"
            >
              {PRICE_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="listing-type-filter"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Listing Type
            </label>
            <select
              id="listing-type-filter"
              value={filters.listingType}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  listingType: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 focus:border-[#0d7369] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d7369]/15"
            >
              {LISTING_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear filters
            </button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <ListingsSkeletonGrid />
      ) : errorMessage ? (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-10 text-center"
        >
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setReloadNonce((n) => n + 1)}
              className="rounded-xl bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setUseMockData(true)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Preview sample data
            </button>
          </div>
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center shadow-xs">
          <p className="text-base font-semibold text-slate-900">
            No listings found
          </p>
          <p className="max-w-sm text-sm text-slate-500">
            {hasActiveFilters
              ? "Try adjusting your location search, price range, or listing type."
              : "There are no rooms or flats posted right now."}
          </p>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-xl bg-[#0d7369] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a5c54]"
              >
                Clear filters
              </button>
            )}
            {!useMockData && (
              <button
                type="button"
                onClick={() => setUseMockData(true)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Preview sample data
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
