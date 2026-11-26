"use client";

import { useState } from "react";
import Link from "next/link";
import {
  formatListingType,
  formatPriceNpr,
  getFirstPhotoUrl,
  type Listing,
} from "./types";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const firstPhotoUrl = getFirstPhotoUrl(listing.listing_photos);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showPhoto = Boolean(firstPhotoUrl && failedSrc !== firstPhotoUrl);

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition hover:-translate-y-0.5 hover:border-[#0d7369]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d7369]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {showPhoto && firstPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstPhotoUrl}
            alt={listing.title}
            loading="lazy"
            onError={() => setFailedSrc(firstPhotoUrl)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[#f2f7f5] text-slate-400">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-8 w-8 text-[#0d7369]/45"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-xs font-medium text-slate-500">
              No photo available
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-[#0d7369]">
              {listing.title}
            </h2>
            <span className="shrink-0 rounded-full bg-[#e8f5f2] px-2.5 py-0.5 text-xs font-semibold text-[#0d7369]">
              {formatListingType(listing.listing_type)}
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              className="h-3.5 w-3.5 shrink-0 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="truncate">{listing.location}</span>
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Rent: {formatPriceNpr(listing.price_npr)} / mo
            </span>
          </div>
        </div>

        <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0d7369] px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#0a5c54]">
          View details
        </span>
      </div>
    </Link>
  );
}
