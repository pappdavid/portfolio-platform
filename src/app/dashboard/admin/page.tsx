import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/admin';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Portfolio Platform',
  robots: { index: false, follow: false }
};

const ADMIN_EMAILS = ['contact@davidpapp.dev'];

async function getAdminData() {
  const [companiesRes, quotasRes, eventsRes] = await Promise.all([
    supabaseAdmin.from('companies').select('*').order('created_at'),
    supabaseAdmin.from('demo_quotas').select('*'),
    supabaseAdmin
      .from('demo_events')
      .select('company_id, user_id, demo_type, created_at')
  ]);

  const companies = companiesRes.data ?? [];
  const quotas = quotasRes.data ?? [];
  const events = eventsRes.data ?? [];

  // Build per-company stats
  const stats = companies.map((c) => {
    const companyEvents = events.filter((e) => e.company_id === c.id);
    const demoTypes = Array.from(
      new Set(companyEvents.map((e) => e.demo_type as string))
    );
    const uniqueUsers = new Set(companyEvents.map((e) => e.user_id)).size;
    const companyQuotas = quotas.filter((q) => q.company_id === c.id);
    const firstVisit = companyEvents.length
      ? new Date(
          Math.min(
            ...companyEvents.map((e) => new Date(e.created_at).getTime())
          )
        )
      : null;
    const lastVisit = companyEvents.length
      ? new Date(
          Math.max(
            ...companyEvents.map((e) => new Date(e.created_at).getTime())
          )
        )
      : null;

    return {
      company: c,
      demoTypes,
      uniqueUsers,
      companyQuotas,
      firstVisit,
      lastVisit
    };
  });

  const totalUsers = new Set(events.map((e) => e.user_id)).size;
  const totalMcpEvents = events.filter((e) => e.demo_type === 'mcp').length;
  const totalTrainingJobs = events.filter(
    (e) => e.demo_type === 'training'
  ).length;
  const soon = new Date();
  soon.setDate(soon.getDate() + 7);
  const expiringCount = quotas.filter(
    (q) => q.status === 'active' && new Date(q.end_at) < soon
  ).length;

  return {
    stats,
    totalUsers,
    totalMcpEvents,
    totalTrainingJobs,
    expiringCount,
    totalCompanies: companies.length
  };
}

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect('/auth/sign-in');

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  if (!ADMIN_EMAILS.includes(email)) {
    return (
      <PageContainer>
        <div className='flex flex-1 flex-col items-center justify-center space-y-4'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground'>
            You do not have permission to view this page.
          </p>
        </div>
      </PageContainer>
    );
  }

  const data = await getAdminData();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <h2 className='text-2xl font-bold tracking-tight'>Admin Panel</h2>

        {/* Analytics cards */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5'>
          {[
            { label: 'Total Users', value: data.totalUsers },
            { label: 'Companies', value: data.totalCompanies },
            { label: 'MCP Events', value: data.totalMcpEvents },
            { label: 'Training Jobs', value: data.totalTrainingJobs },
            { label: 'Expiring (7d)', value: data.expiringCount }
          ].map((card) => (
            <Card key={card.label}>
              <CardHeader className='pb-2'>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className='text-3xl'>{card.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Company tracking table */}
        <Card>
          <CardHeader>
            <CardTitle>Companies</CardTitle>
            <CardDescription>Demo usage by company domain</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Demos</TableHead>
                  <TableHead>First Visit</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Quota Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.stats.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-muted-foreground text-center'
                    >
                      No companies yet
                    </TableCell>
                  </TableRow>
                )}
                {data.stats.map(
                  ({
                    company,
                    demoTypes,
                    uniqueUsers,
                    companyQuotas,
                    firstVisit,
                    lastVisit
                  }) => (
                    <TableRow key={company.id}>
                      <TableCell className='font-medium'>
                        {company.name}
                      </TableCell>
                      <TableCell>{company.domain}</TableCell>
                      <TableCell>{uniqueUsers}</TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {demoTypes.map((t) => (
                            <Badge
                              key={t}
                              variant='outline'
                              className='text-xs'
                            >
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {firstVisit ? firstVisit.toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        {lastVisit ? lastVisit.toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {companyQuotas.map((q) => (
                            <Badge
                              key={q.id}
                              variant={
                                q.status === 'expired' || q.remaining <= 0
                                  ? 'destructive'
                                  : 'outline'
                              }
                              className='text-xs'
                            >
                              {q.demo_type}: {q.remaining}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
