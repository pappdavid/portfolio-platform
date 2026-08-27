import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { LandingContent } from '@/components/landing/landing-content';
import { ReferralBanner } from '@/components/landing/referral-banner';
import { getReferralPersonalization } from '@/lib/referral-context';
import { REFERRAL_COOKIE } from '@/lib/referral-personalization';
import { mergeReferralWithCompanySlug } from '@/lib/company-slug';
import {
  JOB_TYPES,
  getJobTypeSiteView,
  resolveJobType
} from '@/lib/job-type';

interface RolePageProps {
  params: Promise<{ role: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams() {
  return Object.keys(JOB_TYPES).map((role) => ({ role }));
}

export const dynamicParams = false;

const ROLE_DESCRIPTIONS: Record<string, string> = {
  'ai-engineering':
    'End-to-end AI engineering: professional LLM delivery backed by hands-on agent infrastructure.',
  'ai-integration':
    'AI solutions and ERP integration: discovery, solution design, delivery, and production LLM features at WEBINFORM.',
  automation:
    'Workflow automation with LLM APIs, event glue, and fail-closed agent guardrails.',
  'product-engineering':
    'Shipping user-facing AI products end to end with Next.js, TypeScript, and Prisma.'
};

export async function generateMetadata({
  params
}: RolePageProps): Promise<Metadata> {
  const { role } = await params;
  const jobType = resolveJobType(role);
  if (!jobType) return {};

  const description = ROLE_DESCRIPTIONS[jobType.id];
  return {
    title: jobType.metaTitle,
    description,
    openGraph: {
      title: jobType.metaTitle,
      description
    },
    twitter: {
      title: jobType.metaTitle,
      description
    }
  };
}

export default async function JobTypeLandingPage({
  params,
  searchParams
}: RolePageProps) {
  const { role } = await params;
  const jobType = resolveJobType(role);
  if (!jobType) notFound();

  const query = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const token = cookieStore.get(REFERRAL_COOKIE)?.value;
  const cookieReferral = await getReferralPersonalization(token);
  const referral = mergeReferralWithCompanySlug(cookieReferral, query.c);

  // Referral copy (tracked recruiter links) stays the most specific override;
  // otherwise the job-type profile shapes hero, focus, chat, and CTAs.
  const view = getJobTypeSiteView(jobType, referral);

  return (
    <>
      <ReferralBanner referral={referral} />
      <LandingContent view={view} />
    </>
  );
}
