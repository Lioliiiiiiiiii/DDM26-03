import Link from 'next/link';
import { siteConfig } from '@/data';

export function ContactFooter() {
  return (
    <footer className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">About</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{siteConfig.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-slate-300 transition hover:text-orange-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.website}</li>
            <li>{siteConfig.contact.location}</li>
          </ul>
        </div>
      </div>
      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">Partners</p>
        <div className="mt-3 flex flex-wrap items-center gap-5">
          {siteConfig.logos.partners.map((partner) => (
            <img key={partner.alt} src={partner.src} alt={partner.alt} className="h-7 w-auto opacity-90" />
          ))}
        </div>
      </div>
    </footer>
  );
}
