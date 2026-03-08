'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  IconPlus,
  IconCopy,
  IconCheck,
  IconLoader2,
  IconExternalLink
} from '@tabler/icons-react';
import { toast } from 'sonner';

interface RefEvent {
  id: string;
  event_type: string;
  created_at: string;
}

interface RefLink {
  id: string;
  token: string;
  company: string;
  notes: string | null;
  created_at: string;
  events: RefEvent[];
  event_count: number;
}

export function ReferralsDashboardContent() {
  const [links, setLinks] = useState<RefLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ref/events');
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch {
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function createLink() {
    if (!company.trim()) {
      toast.error('Company name is required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/ref', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.trim(),
          notes: notes.trim() || undefined
        })
      });
      if (!res.ok) throw new Error('Failed to create link');
      const data = await res.json();
      setLinks((prev) => [
        {
          id: data.id,
          token: data.token,
          company: data.company,
          notes: notes.trim() || null,
          created_at: data.created_at,
          events: [],
          event_count: 0
        },
        ...prev
      ]);
      setCompany('');
      setNotes('');
      setDialogOpen(false);
      toast.success('Referral link created');
    } catch {
      toast.error('Failed to create link');
    } finally {
      setCreating(false);
    }
  }

  function copyLink(link: RefLink) {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/r/${link.token}`);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Link copied to clipboard');
  }

  function getLastOpened(link: RefLink): string {
    if (link.events.length === 0) return 'Never';
    const sorted = [...link.events].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return new Date(sorted[0].created_at).toLocaleDateString();
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Referral Links</CardTitle>
              <CardDescription>
                Track portfolio views from specific companies
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm'>
                  <IconPlus className='mr-2 size-4' />
                  Create Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Referral Link</DialogTitle>
                  <DialogDescription>
                    Generate a unique link to track visits from a specific
                    company.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='company'>Company Name</Label>
                    <Input
                      id='company'
                      placeholder='e.g. Anthropic, Google, Stripe'
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor='notes'>Notes (optional)</Label>
                    <Textarea
                      id='notes'
                      placeholder='e.g. Applied for AI Engineer role'
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createLink} disabled={creating}>
                    {creating && (
                      <IconLoader2 className='mr-2 size-4 animate-spin' />
                    )}
                    Create Link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Loading referral links...
            </div>
          ) : links.length === 0 ? (
            <div className='text-muted-foreground space-y-2 py-8 text-center text-sm'>
              <p>No referral links yet.</p>
              <p>
                Create one to start tracking portfolio views from specific
                companies.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Opens</TableHead>
                  <TableHead>Last Opened</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='w-[120px]' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className='font-medium'>
                      {link.company}
                    </TableCell>
                    <TableCell className='text-muted-foreground max-w-[200px] truncate text-sm'>
                      {link.notes || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={link.event_count > 0 ? 'outline' : 'secondary'}
                      >
                        {link.event_count}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {getLastOpened(link)}
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {new Date(link.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => copyLink(link)}
                        >
                          {copiedId === link.id ? (
                            <IconCheck className='size-4' />
                          ) : (
                            <IconCopy className='size-4' />
                          )}
                        </Button>
                        <Button variant='ghost' size='sm' asChild>
                          <a
                            href={`/r/${link.token}`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <IconExternalLink className='size-4' />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
