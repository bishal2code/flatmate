// Simple HeroBanner component used on flatmates page
// Mobile‑first, Tailwind only – follows project conventions.

type HeroBannerProps = { src: string; title: string; subtitle: string };

export default function HeroBanner({ src, title, subtitle }: HeroBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gray-100">
      {/* Background image – replace with your own asset if needed */}
      <img
        src="/hero-flatmates.png"
        alt="Flatmates hero"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="relative z-10 flex h-64 items-center justify-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
          Find Your Ideal Flatmate
        </h1>
      </div>
    </section>
  );
}
