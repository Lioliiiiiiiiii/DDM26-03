'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <img
            src={siteConfig.logos.primary.src}
            alt={siteConfig.logos.primary.alt}
            className="h-8 w-auto rounded-md border border-white/10 bg-slate-900/70 p-1"
          />
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200 transition group-hover:text-orange-100 md:text-base">
            {siteConfig.shortName}
          </span>
        </Link>

        <nav aria-label="Primary" className="overflow-x-auto">
          <ul className="flex min-w-max items-center gap-1 rounded-lg border border-white/10 bg-slate-900/70 p-1">
            {siteConfig.navigation.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'inline-flex rounded-md px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] transition md:px-4',
                      active
                        ? 'bg-orange-500/20 text-orange-100'
                        : 'text-slate-300 hover:bg-white/10 hover:text-slate-100'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
