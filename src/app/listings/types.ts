export interface ListingPhoto {
  id: string;
  image_url: string;
  sort_order: number | null;
}

export interface Listing {
  id: string;
  created_at: string;
  title: string;
  listing_type: string;
  location: string;
  price_npr: number;
  listing_photos?: ListingPhoto[] | null;
}

export type PriceRangeValue = "all" | "under_5000" | "5000_10000" | "over_10000";

export interface ListingFilters {
  location: string;
  priceRange: PriceRangeValue;
  listingType: string;
}

export const DEFAULT_FILTERS: ListingFilters = {
  location: "",
  priceRange: "all",
  listingType: "all",
};

export const PRICE_RANGE_OPTIONS: ReadonlyArray<{
  value: PriceRangeValue;
  label: string;
}> = [
  { value: "all", label: "All prices" },
  { value: "under_5000", label: "Under NPR 5,000" },
  { value: "5000_10000", label: "NPR 5,000 – 10,000" },
  { value: "over_10000", label: "Over NPR 10,000" },
];

export const LISTING_TYPE_OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
}> = [
  { value: "all", label: "All types" },
  { value: "room", label: "Room" },
  { value: "flat", label: "Flat" },
  { value: "shared_room", label: "Shared Room" },
  { value: "apartment", label: "Apartment" },
  { value: "hostel", label: "Hostel" },
];

/** Normalizes NEXT_PUBLIC_SUPABASE_URL whether or not it already ends with /rest/v1. */
export function buildListingsQueryUrl(
  supabaseUrl: string,
  filters: ListingFilters
): string {
  const trimmed = supabaseUrl.replace(/\/+$/, "");
  const restBase = trimmed.endsWith("/rest/v1") ? trimmed : `${trimmed}/rest/v1`;

  const params = new URLSearchParams();
  params.set(
    "select",
    "id,created_at,title,listing_type,location,price_npr,listing_photos(id,image_url,sort_order)"
  );
  params.set("order", "created_at.desc");
  params.set("listing_photos.order", "sort_order.asc");

  const sanitizedLocation = filters.location.trim().replaceAll("*", "");
  if (sanitizedLocation) {
    params.set("location", `ilike.*${sanitizedLocation}*`);
  }

  if (filters.priceRange === "under_5000") {
    params.append("price_npr", "lt.5000");
  } else if (filters.priceRange === "5000_10000") {
    params.append("price_npr", "gte.5000");
    params.append("price_npr", "lte.10000");
  } else if (filters.priceRange === "over_10000") {
    params.append("price_npr", "gt.10000");
  }

  if (filters.listingType !== "all") {
    // Replace underscores with * so "shared_room" matches both "shared_room" and "Shared Room".
    const pattern = filters.listingType.trim().replaceAll("_", "*");
    if (pattern) {
      params.set("listing_type", `ilike.${pattern}`);
    }
  }

  return `${restBase}/listings?${params.toString()}`;
}

/** Returns the first photo URL ordered by sort_order ascending, or null when absent. */
export function getFirstPhotoUrl(
  photos: ListingPhoto[] | null | undefined
): string | null {
  if (!photos || photos.length === 0) return null;

  const sorted = [...photos].sort(
    (a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER)
  );
  const firstUrl = sorted[0]?.image_url?.trim();
  return firstUrl ? firstUrl : null;
}

export function formatPriceNpr(price: number): string {
  if (!Number.isFinite(price)) return "NPR —";
  return `NPR ${new Intl.NumberFormat("en-NP").format(price)}`;
}

export function formatListingType(listingType: string): string {
  const cleaned = listingType.trim().replaceAll("_", " ");
  if (!cleaned) return "Listing";
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}
