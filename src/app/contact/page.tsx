import type { Metadata } from 'next';
import { siteConfig } from '@/data';
import { DataCard } from '@/components/DataCard';
import { MotionReveal } from '@/components/MotionReveal';
import { SectionHeader } from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Digital Disruption Matrix editorial and research team.'
};

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <MotionReveal>
        <SectionHeader
          label="Contact"
          title="Connect with the research team"
          description="Request a briefing, discuss methodology, or explore partnership opportunities for the 2026 edition."
        />
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.9fr]">
          <DataCard title="Send a message" subtitle="We respond within two business days.">
            <form className="space-y-4" aria-label="Contact form">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-200">
                  <span>Organization</span>
                  <input
                    type="text"
                    name="organization"
                    className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Message</span>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none ring-orange-300/70 transition focus:ring"
                />
              </label>
              <button
                type="submit"
                className="inline-flex rounded-lg border border-orange-300/45 bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-500/30"
              >
                Submit Inquiry
              </button>
            </form>
          </DataCard>

          <DataCard title="Project information" subtitle="Digital Disruption Matrix 2026">
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span aria-hidden className="text-orange-200">
                  Email
                </span>
                {siteConfig.contact.email}
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="text-orange-200">
                  Website
                </span>
                {siteConfig.contact.website}
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="text-orange-200">
                  Location
                </span>
                {siteConfig.contact.location}
              </li>
            </ul>
            <p className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-300">
              For speaking or institutional collaborations, include timeline, audience, and required depth of
              analysis in your message.
            </p>
          </DataCard>
        </div>
      </MotionReveal>
    </div>
  );
}
