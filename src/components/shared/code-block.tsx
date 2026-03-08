'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconCheck, IconCopy } from '@tabler/icons-react';

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  className
}: {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border',
        className
      )}
    >
      {filename && (
        <div className='bg-muted/50 border-b px-4 py-2'>
          <span className='text-muted-foreground font-mono text-xs'>
            {filename}
          </span>
        </div>
      )}
      <div className='relative'>
        <pre className='bg-muted/30 overflow-x-auto p-4'>
          <code className='font-mono text-sm leading-relaxed'>{code}</code>
        </pre>
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100'
          onClick={handleCopy}
        >
          {copied ? (
            <IconCheck className='h-4 w-4' />
          ) : (
            <IconCopy className='h-4 w-4' />
          )}
        </Button>
      </div>
    </div>
  );
}
