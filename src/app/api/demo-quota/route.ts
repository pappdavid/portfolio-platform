import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateCompanyForUser } from '@/lib/company';
import {
  ensureQuotaForDemo,
  getQuotaInfo,
  type DemoType
} from '@/lib/demo-quota';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const demoType = searchParams.get('demoType') as DemoType | null;

  if (!demoType || !['mcp', 'training', 'rag'].includes(demoType)) {
    return NextResponse.json(
      { error: 'Invalid demoType. Must be one of: mcp, training, rag' },
      { status: 400 }
    );
  }

  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const company = await getOrCreateCompanyForUser(user);
    const quota = await getQuotaInfo(company.companyId, demoType);

    if (!quota) {
      // Initialize quota lazily
      const initialized = await ensureQuotaForDemo(company.companyId, demoType);
      return NextResponse.json({ quota: initialized, company });
    }

    return NextResponse.json({ quota, company });
  } catch (err) {
    console.error('[demo-quota] GET error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
