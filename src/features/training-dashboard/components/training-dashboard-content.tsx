'use client';

import { useEffect, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  IconDownload,
  IconBrandGithub,
  IconUpload,
  IconBrain,
  IconClock
} from '@tabler/icons-react';
import { toast } from 'sonner';

interface Dataset {
  id: string;
  name: string;
  source_type: string;
  source_url: string | null;
  storage_path: string | null;
  format: string;
  record_count: number;
  created_at: string;
}

interface TrainingJob {
  id: string;
  dataset_id: string;
  provider: string;
  model: string;
  preset: string;
  status: string;
  artifact_url: string | null;
  created_at: string;
  updated_at: string;
}

export function TrainingDashboardContent() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/training/datasets');
      if (res.ok) {
        const data = await res.json();
        setDatasets(data.datasets || []);
        setJobs(data.jobs || []);
      }
    } catch {
      toast.error('Failed to load training data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'outline' as const;
      case 'running':
        return 'secondary' as const;
      case 'failed':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Datasets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Datasets</CardTitle>
          <CardDescription>
            Generated JSONL datasets from your code repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Loading datasets...
            </div>
          ) : datasets.length === 0 ? (
            <div className='text-muted-foreground space-y-2 py-8 text-center text-sm'>
              <p>No datasets yet.</p>
              <p>
                Use the{' '}
                <a href='/training' className='text-primary underline'>
                  Training page
                </a>{' '}
                or POST to /api/training with a GitHub URL.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='w-[80px]' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.map((ds) => (
                  <TableRow key={ds.id}>
                    <TableCell className='font-medium'>{ds.name}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5'>
                        {ds.source_type === 'github' ? (
                          <IconBrandGithub className='size-4' />
                        ) : (
                          <IconUpload className='size-4' />
                        )}
                        <span className='text-muted-foreground max-w-[200px] truncate text-sm'>
                          {ds.source_url || ds.source_type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{ds.format}</Badge>
                    </TableCell>
                    <TableCell className='tabular-nums'>
                      {ds.record_count}
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {new Date(ds.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {ds.storage_path && (
                        <Button variant='ghost' size='sm'>
                          <IconDownload className='size-4' />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Training Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Training Jobs</CardTitle>
          <CardDescription>LoRA fine-tuning job status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='text-muted-foreground py-8 text-center text-sm'>
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className='text-muted-foreground space-y-2 py-8 text-center text-sm'>
              <p>No training jobs submitted yet.</p>
              <p>
                Generate a dataset first, then submit a training job with your
                HuggingFace token.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className='pt-6'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <IconBrain className='text-muted-foreground size-4' />
                          <span className='font-medium'>{job.model}</span>
                        </div>
                        <p className='text-muted-foreground text-sm'>
                          {job.provider} &middot; {job.preset} preset
                        </p>
                      </div>
                      <Badge variant={statusColor(job.status)}>
                        {job.status === 'running' && (
                          <IconClock className='mr-1 size-3' />
                        )}
                        {job.status}
                      </Badge>
                    </div>
                    <div className='text-muted-foreground mt-3 text-xs'>
                      Started {new Date(job.created_at).toLocaleDateString()}
                      {job.artifact_url && (
                        <a
                          href={job.artifact_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary ml-2 underline'
                        >
                          Download artifact
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
