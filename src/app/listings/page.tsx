import type { Metadata } from "next";
import ListingsBrowser from "./ListingsBrowser";
import HeroBanner from "@/components/ui/HeroBanner";

export const metadata: Metadata = {
  title: "Rooms & Flats | Flatmate",
  description:
    "Browse available rooms, flats, and shared spaces for rent in Pokhara, Nepal.",
};

export default function ListingsPage() {
  return (
    <>
      {/* Hero banner */}
      <HeroBanner
        src="/hero-listings.png"
        title="Rooms & Flats in Pokhara"
        subtitle="Find your next home – rent, share, or sublet"
      />

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <ListingsBrowser />
      </main>
    </>
  );
}
