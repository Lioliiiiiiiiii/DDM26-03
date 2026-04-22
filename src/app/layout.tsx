import type { Metadata } from 'next';
import '@/app/globals.css';
import { Navbar } from '@/components/Navbar';
import { ContactFooter } from '@/components/ContactFooter';
import { siteConfig } from '@/data';

export const metadata: Metadata = {
  metadataBase: new URL('https://digitaldisruptionmatrix2026.example.com'),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`
  },
  description: siteConfig.description,
  keywords: [
    'digital disruption',
    'technology heatmap',
    'industry intelligence',
    'strategic foresight',
    'innovation research'
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-[1280px] px-4 pb-12 pt-8 md:px-8">{children}</main>
        <div className="mx-auto mb-10 w-full max-w-[1280px] px-4 md:px-8">
          <ContactFooter />
        </div>
      </body>
    </html>
  );
}
