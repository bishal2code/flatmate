"use client";

import Image from "next/image";

interface HeroBannerProps {
  /** Path relative to the public folder, e.g. "/hero-listings.png" */
  src: string;
  /** Optional overlay title */
  title?: string;
  /** Optional description text */
  subtitle?: string;
}

/**
 * Simple full‑width hero banner with a background image.
 * The image fills the area via object‑cover.
 */
export default function HeroBanner({ src, title, subtitle }: HeroBannerProps) {
  return (
    <section className="relative h-[260px] w-full overflow-hidden">
      {/* Background image */}
      <Image
        src={src}
        alt={title ?? "Hero banner"}
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Text overlay */}
      {(title || subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {title && (
            <h1 className="text-3xl font-bold text-white drop-shadow-md">{title}</h1>
          )}
          {subtitle && (
            <p className="mt-2 text-lg text-white drop-shadow-md">{subtitle}</p>
          )}
        </div>
      )}
    </section>
  );
}
