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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  IconTrash,
  IconCopy,
  IconCheck,
  IconLoader2
} from '@tabler/icons-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  key_prefix: string;
  name: string;
  revoked_at: string | null;
  created_at: string;
  key?: string;
}

interface McpEvent {
  id: string;
  tool_name: string;
  action: string;
  meta_json: Record<string, unknown>;
  created_at: string;
}

export function McpDashboardContent() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [events, setEvents] = useState<McpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [retention, setRetention] = useState('30');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [keysRes, eventsRes] = await Promise.all([
        fetch('/api/mcp/keys'),
        fetch(`/api/mcp/events?days=${retention}`)
      ]);
      if (keysRes.ok) {
        const data = await keysRes.json();
        setKeys(data.keys || []);
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [retention]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function generateKey() {
    setCreating(true);
    try {
      const res = await fetch('/api/mcp/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || 'Untitled Key' })
      });
      if (!res.ok) throw new Error('Failed to generate key');
      const data = await res.json();
      setNewKey(data.key);
      setKeys((prev) => [
        {
          id: data.id,
          key_prefix: data.key_prefix,
          name: data.name,
          revoked_at: null,
          created_at: data.created_at
        },
        ...prev
      ]);
      setNewKeyName('');
    } catch {
      toast.error('Failed to generate key');
    } finally {
      setCreating(false);
    }
  }

  async function revokeKey(keyId: string) {
    try {
      const res = await fetch(`/api/mcp/keys?id=${keyId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to revoke key');
      setKeys((prev) =>
        prev.map((k) =>
          k.id === keyId ? { ...k, revoked_at: new Date().toISOString() } : k
        )
      );
      toast.success('Key revoked');
    } catch {
      toast.error('Failed to revoke key');
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  const activeKeys = keys.filter((k) => !k.revoked_at);
  const revokedKeys = keys.filter((k) => k.revoked_at);

  return (
    <div className='space-y-6'>
      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your MCP Sentinel API keys
              </CardDescription>
            </div>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setNewKey(null);
              }}
            >
              <DialogTrigger asChild>
                <Button size='sm'>
                  <IconPlus className='mr-2 size-4' />
                  Generate Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate API Key</DialogTitle>
                  <DialogDescription>
                    {newKey
                      ? 'Save this key now. It will not be shown again.'
                      : 'Create a new API key for MCP Sentinel.'}
                  </DialogDescription>
                </DialogHeader>
                {newKey ? (
                  <div className='space-y-3'>
                    <div className='bg-muted flex items-center gap-2 rounded-lg p-3 font-mono text-sm break-all'>
                      {newKey}
                    </div>
                    <Button
                      variant='outline'
                      className='w-full'
                      onClick={() => copyToClipboard(newKey)}
                    >
                      {copiedKey ? (
                        <IconCheck className='mr-2 size-4' />
                      ) : (
                        <IconCopy className='mr-2 size-4' />
                      )}
                      {copiedKey ? 'Copied' : 'Copy to Clipboard'}
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <div>
                      <Label htmlFor='key-name'>Key Name</Label>
                      <Input
                        id='key-name'
                        placeholder='e.g. Production, Testing'
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={generateKey} disabled={creating}>
                        {creating && (
                          <IconLoader2 className='mr-2 size-4 animate-spin' />
                        )}
                        Generate
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Loading keys...
            </div>
          ) : activeKeys.length === 0 && revokedKeys.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              No API keys yet. Generate one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Prefix</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='w-[80px]' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className='font-medium'>{key.name}</TableCell>
                    <TableCell className='font-mono text-sm'>
                      {key.key_prefix}...
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>Active</Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {new Date(key.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => revokeKey(key.id)}
                      >
                        <IconTrash className='size-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {revokedKeys.map((key) => (
                  <TableRow key={key.id} className='opacity-50'>
                    <TableCell className='font-medium'>{key.name}</TableCell>
                    <TableCell className='font-mono text-sm'>
                      {key.key_prefix}...
                    </TableCell>
                    <TableCell>
                      <Badge variant='destructive'>Revoked</Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {new Date(key.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Event Log Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Event Log</CardTitle>
              <CardDescription>Recent MCP tool call events</CardDescription>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Label htmlFor='show-payload' className='text-sm'>
                  Show payload
                </Label>
                <Switch
                  id='show-payload'
                  checked={showPayload}
                  onCheckedChange={setShowPayload}
                />
              </div>
              <Select value={retention} onValueChange={setRetention}>
                <SelectTrigger className='w-[120px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='7'>7 days</SelectItem>
                  <SelectItem value='30'>30 days</SelectItem>
                  <SelectItem value='90'>90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              No events recorded yet. Events will appear as your MCP tools are
              called.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Action</TableHead>
                  {showPayload && <TableHead>Payload</TableHead>}
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className='font-mono text-sm'>
                      {event.tool_name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.action === 'deny'
                            ? 'destructive'
                            : event.action === 'warn'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {event.action}
                      </Badge>
                    </TableCell>
                    {showPayload && (
                      <TableCell className='max-w-[300px] truncate font-mono text-xs'>
                        {JSON.stringify(event.meta_json)}
                      </TableCell>
                    )}
                    <TableCell className='text-muted-foreground text-sm'>
                      {new Date(event.created_at).toLocaleString()}
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
