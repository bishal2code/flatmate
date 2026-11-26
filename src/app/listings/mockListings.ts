import type { Listing, ListingFilters } from "./types";

function makeRoomPreviewDataUri(
  bgTop: string,
  bgBottom: string,
  accent: string,
  label: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgTop}"/>
        <stop offset="100%" stop-color="${bgBottom}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#g)"/>
    <rect x="70" y="90" width="220" height="170" rx="12" fill="#ffffff" fill-opacity="0.72"/>
    <line x1="180" y1="90" x2="180" y2="260" stroke="${accent}" stroke-opacity="0.28" stroke-width="4"/>
    <line x1="70" y1="175" x2="290" y2="175" stroke="${accent}" stroke-opacity="0.28" stroke-width="4"/>
    <rect x="330" y="250" width="380" height="125" rx="18" fill="${accent}" fill-opacity="0.88"/>
    <rect x="355" y="218" width="120" height="44" rx="12" fill="#ffffff" fill-opacity="0.92"/>
    <rect x="70" y="345" width="660" height="70" rx="12" fill="#0f172a" fill-opacity="0.08"/>
    <text x="400" y="452" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="#1e293b" fill-opacity="0.78">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "mock-1",
    created_at: "2026-11-26T05:30:00Z",
    title: "Sunny Single Room near Lakeside",
    listing_type: "room",
    location: "Lakeside, Pokhara",
    price_npr: 6500,
    listing_photos: [
      {
        id: "p-1b",
        image_url: makeRoomPreviewDataUri("#d1fae5", "#a7f3d0", "#0d7369", "Balcony View"),
        sort_order: 2,
      },
      {
        id: "p-1a",
        image_url: makeRoomPreviewDataUri("#e6f4f1", "#ccebe4", "#0d7369", "Lakeside Single Room"),
        sort_order: 1,
      },
    ],
  },
  {
    id: "mock-2",
    created_at: "2026-11-26T04:15:00Z",
    title: "2BHK Family Flat in Bagar",
    listing_type: "flat",
    location: "Bagar, Pokhara",
    price_npr: 14500,
    listing_photos: [
      {
        id: "p-2a",
        image_url: makeRoomPreviewDataUri("#e0f2fe", "#bae6fd", "#0369a1", "2BHK Flat · Bagar"),
        sort_order: 1,
      },
    ],
  },
  {
    id: "mock-3",
    created_at: "2026-11-25T18:00:00Z",
    title: "Budget Student Room in Mahendrapul",
    listing_type: "room",
    location: "Mahendrapul, Pokhara",
    price_npr: 4200,
    listing_photos: [],
  },
  {
    id: "mock-4",
    created_at: "2026-11-25T14:20:00Z",
    title: "Shared Room for Students",
    listing_type: "shared_room",
    location: "Prithvi Chowk, Pokhara",
    price_npr: 3800,
    listing_photos: [
      {
        id: "p-4a",
        image_url: makeRoomPreviewDataUri("#fef3c7", "#fde68a", "#b45309", "Shared Room · Prithvi Chowk"),
        sort_order: 1,
      },
    ],
  },
  {
    id: "mock-5",
    created_at: "2026-11-25T09:45:00Z",
    title: "Furnished Studio Apartment",
    listing_type: "apartment",
    location: "Srijana Chowk, Pokhara",
    price_npr: 18000,
    listing_photos: [
      {
        id: "p-5a",
        image_url: makeRoomPreviewDataUri("#ede9fe", "#ddd6fe", "#6d28d9", "Furnished Studio Apartment"),
        sort_order: 1,
      },
    ],
  },
  {
    id: "mock-6",
    created_at: "2026-11-24T16:10:00Z",
    title: "Quiet Hostel Bed near Campus",
    listing_type: "hostel",
    location: "Bagar, Pokhara",
    price_npr: 7500,
    listing_photos: [
      {
        id: "p-6a",
        image_url: makeRoomPreviewDataUri("#f1f5f9", "#e2e8f0", "#0d7369", "Hostel Room · Bagar"),
        sort_order: 1,
      },
    ],
  },
];

export function filterMockListings(
  items: Listing[],
  filters: ListingFilters
): Listing[] {
  const query = filters.location.trim().toLowerCase();

  return items
    .filter((item) => {
      if (query && !item.location.toLowerCase().includes(query)) {
        return false;
      }

      if (filters.priceRange === "under_5000" && !(item.price_npr < 5000)) {
        return false;
      }
      if (
        filters.priceRange === "5000_10000" &&
        !(item.price_npr >= 5000 && item.price_npr <= 10000)
      ) {
        return false;
      }
      if (filters.priceRange === "over_10000" && !(item.price_npr > 10000)) {
        return false;
      }

      if (
        filters.listingType !== "all" &&
        item.listing_type.toLowerCase() !== filters.listingType.toLowerCase()
      ) {
        return false;
      }

      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}
