'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { DemoType } from '@/lib/demo-quota';

interface QuotaData {
  remaining: number;
  status: string;
  endAt: string;
}

interface DemoQuotaIndicatorProps {
  demoType: DemoType;
  className?: string;
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function DemoQuotaIndicator({
  demoType,
  className
}: DemoQuotaIndicatorProps) {
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/demo-quota?demoType=${demoType}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.quota) setQuota(data.quota);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [demoType]);

  if (loading) return null;

  if (!quota) return null;

  const isExpired =
    quota.status === 'expired' || new Date(quota.endAt) < new Date();
  const daysLeft = daysUntil(quota.endAt);

  if (isExpired || quota.remaining <= 0) {
    return (
      <div className={className}>
        <Badge variant='destructive' className='text-xs'>
          Demo expired — contact David for full access
        </Badge>
      </div>
    );
  }

  return (
    <div className={className}>
      <Badge variant='outline' className='text-xs'>
        {quota.remaining} remaining · expires in {daysLeft}d
      </Badge>
    </div>
  );
}
