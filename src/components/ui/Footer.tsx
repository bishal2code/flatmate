import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">Flatmate</p>
          <p>Rooms, flats &amp; flatmates in Pokhara, Nepal.</p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-4 font-medium text-slate-600"
        >
          <Link href="/" className="transition hover:text-[#0d7369]">
            Home
          </Link>
          <Link href="/listings" className="transition hover:text-[#0d7369]">
            Rooms &amp; Flats
          </Link>
          <Link
            href="/listings/new"
            className="transition hover:text-[#0d7369]"
          >
            Post listing
          </Link>
          <Link href="/flatmates" className="transition hover:text-[#0d7369]">
            Flatmates
          </Link>
          <Link
            href="/flatmates/new"
            className="transition hover:text-[#0d7369]"
          >
            Post requirement
          </Link>
        </nav>
      </div>
    </footer>
  );
}
