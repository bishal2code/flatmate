import type { Metadata } from "next";
import { Suspense } from "react";
import ListingsBrowser from "./ListingsBrowser";
import ListingsSkeletonGrid from "./ListingsSkeletonGrid";

export const metadata: Metadata = {
  title: "Rooms & Flats | Flatmate",
  description:
    "Browse available rooms, flats, and shared spaces for rent in Pokhara, Nepal.",
};

export default function ListingsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Suspense fallback={<ListingsSkeletonGrid />}>
        <ListingsBrowser />
      </Suspense>
    </main>
  );
}
