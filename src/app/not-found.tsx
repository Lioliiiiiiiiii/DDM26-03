import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-100">Page not found</h1>
      <p className="mt-2 text-sm text-slate-300">The requested page does not exist in this edition.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg border border-orange-300/45 bg-orange-500/15 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/25"
      >
        Return to Home
      </Link>
    </div>
  );
}
