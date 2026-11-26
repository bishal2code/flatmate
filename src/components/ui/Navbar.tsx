"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PostChooser from "@/components/post-chooser";

export default function Navbar() {
  const pathname = usePathname();
  const isFlatmates = pathname.startsWith("/flatmates");
  const isListings = pathname.startsWith("/listings") && !isFlatmates;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0d7369] text-white shadow-xs">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
              />
            </svg>
          </span>
          <div>
            <p className="text-base font-bold leading-tight text-slate-900">
              Flatmate
            </p>
            <p className="text-xs text-slate-500">
              Your next place, the right flatmate.
            </p>
          </div>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-3 flex w-full items-center justify-center rounded-xl bg-slate-100 p-1 sm:order-2 sm:w-auto"
        >
          <Link
            href="/listings"
            aria-current={isListings ? "page" : undefined}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition sm:flex-initial ${
              isListings
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className={`h-4 w-4 ${isListings ? "text-[#0d7369]" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Rooms &amp; Flats
          </Link>
          <Link
            href="/flatmates"
            aria-current={isFlatmates ? "page" : undefined}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition sm:flex-initial ${
              isFlatmates
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className={`h-4 w-4 ${isFlatmates ? "text-[#0d7369]" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            Flatmates
          </Link>
        </nav>

        <PostChooser />
      </div>
    </header>
  );
}
