import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IndustryOverviewTemplate } from '@/components/IndustryOverviewTemplate';
import { industryOverviewPages } from '@/data';

type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return industryOverviewPages.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryOverviewPages.find((item) => item.slug === slug);

  if (!industry) {
    return { title: 'Industry Not Found' };
  }

  return {
    title: industry.name,
    description: industry.summary
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = industryOverviewPages.find((item) => item.slug === slug);

  if (!industry) {
    notFound();
  }

  return <IndustryOverviewTemplate industry={industry} />;
}
