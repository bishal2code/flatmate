"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const PHOTO_BUCKET = "listing-photos";

type ListingForm = {
  title: string;
  description: string;
  listing_type: string;
  location: string;
  price_npr: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
};

const initialForm: ListingForm = {
  title: "",
  description: "",
  listing_type: "room",
  location: "",
  price_npr: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
};

const inputClass =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10";
const labelClass = "block text-sm font-medium text-slate-800";

function getSupabaseConfig() {
  // Supabase expects the project root here. Accept the common API URL copied
  // from dashboard examples too, so we don't accidentally append REST/Storage
  // routes twice (for example /rest/v1/rest/v1/listings).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    ?.replace(/\/(?:rest\/v1|storage\/v1)\/?$/i, "")
    .replace(/\/+$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url, key };
}

async function readError(response: Response) {
  const body = await response.json().catch(() => null);
  return body?.message ?? body?.error_description ?? body?.error ?? response.statusText;
}

export default function NewListingPage() {
  const [form, setForm] = useState(initialForm);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [listingId, setListingId] = useState<string | null>(null);

  useEffect(() => {
    const urls = photos.map((photo) => URL.createObjectURL(photo));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    setPhotos(Array.from(event.target.files ?? []));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setListingId(null);
    setIsSubmitting(true);

    try {
      const { url, key } = getSupabaseConfig();
      const headers = {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      };
      const listingResponse = await fetch(`${url}/rest/v1/listings?select=id`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({
          ...form,
          price_npr: Number(form.price_npr),
          description: form.description.trim() || null,
          contact_email: form.contact_email.trim() || null,
        }),
      });

      if (!listingResponse.ok) {
        throw new Error(await readError(listingResponse));
      }
      const [listing] = (await listingResponse.json()) as { id: string }[];
      if (!listing?.id) throw new Error("The listing was saved without returning an ID.");

      const uploadedPhotos: { listing_id: string; image_url: string; sort_order: number }[] = [];
      for (const [sortOrder, photo] of photos.entries()) {
        const extension = photo.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
        const objectPath = `${listing.id}/${Date.now()}-${sortOrder}.${extension}`;
        const uploadResponse = await fetch(
          `${url}/storage/v1/object/${PHOTO_BUCKET}/${objectPath}`,
          {
            method: "POST",
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              "Content-Type": photo.type || "application/octet-stream",
              "x-upsert": "false",
            },
            body: photo,
          },
        );
        if (!uploadResponse.ok) {
          throw new Error(`Could not upload ${photo.name}: ${await readError(uploadResponse)}`);
        }
        uploadedPhotos.push({
          listing_id: listing.id,
          image_url: `${url}/storage/v1/object/public/${PHOTO_BUCKET}/${objectPath}`,
          sort_order: sortOrder,
        });
      }

      if (uploadedPhotos.length > 0) {
        const photoResponse = await fetch(`${url}/rest/v1/listing_photos`, {
          method: "POST",
          headers,
          body: JSON.stringify(uploadedPhotos),
        });
        if (!photoResponse.ok) {
          throw new Error(`Listing saved, but its photo records could not be saved: ${await readError(photoResponse)}`);
        }
      }
      setListingId(listing.id);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong while publishing.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/listings"
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <span aria-hidden="true">←</span> Back to rooms &amp; flats
        </Link>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
          <header className="mb-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              RoomFinder · Pokhara
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Post a room or flat
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Share the details so people can find their next place.
            </p>
          </header>

          {listingId ? (
            <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-950">
              <p className="font-semibold">Your listing is published.</p>
              <Link className="mt-2 inline-block font-medium underline underline-offset-4" href={`/listings/${listingId}`}>
                View your listing
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Listing title <span className="text-rose-600">*</span>
                  <input className={inputClass} name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sunny room near Lakeside" required />
                </label>
                <label className={labelClass}>
                  Listing type <span className="text-rose-600">*</span>
                  <select className={inputClass} name="listing_type" value={form.listing_type} onChange={(e) => setForm({ ...form, listing_type: e.target.value })} required>
                    <option value="room">Room</option>
                    <option value="flat">Flat</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Preferred location <span className="text-rose-600">*</span>
                  <input className={inputClass} name="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Lakeside, Pokhara" required />
                </label>
                <label className={labelClass}>
                  Monthly rent (NPR) <span className="text-rose-600">*</span>
                  <input className={inputClass} name="price_npr" type="number" min="0" step="1" value={form.price_npr} onChange={(e) => setForm({ ...form, price_npr: e.target.value })} placeholder="e.g. 12000" required />
                </label>
              </div>

              <label className={labelClass}>
                Description
                <textarea className={`${inputClass} min-h-28 resize-y`} name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell people about the room, facilities, and house rules..." rows={4} />
              </label>

              <div>
                <label className={labelClass} htmlFor="listing-photos">Photos</label>
                <p className="mt-1 text-xs text-slate-500">Choose a few clear photos of the room or flat.</p>
                <input id="listing-photos" className="mt-3 block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800" type="file" accept="image/*" multiple onChange={handlePhotosChange} />
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {previews.map((preview, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={preview} src={preview} alt={`Selected listing photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">Contact details</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Contact name <span className="text-rose-600">*</span>
                    <input className={inputClass} name="contact_name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} placeholder="Your name" required />
                  </label>
                  <label className={labelClass}>
                    Contact phone <span className="text-rose-600">*</span>
                    <input className={inputClass} name="contact_phone" type="tel" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} placeholder="98XXXXXXXX" required />
                  </label>
                  <label className={`${labelClass} sm:col-span-2`}>
                    Contact email <span className="font-normal text-slate-400">(optional)</span>
                    <input className={inputClass} name="contact_email" type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} placeholder="you@example.com" />
                  </label>
                </div>
              </div>

              {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Link href="/listings" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</Link>
                <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? "Publishing…" : "Publish listing"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
