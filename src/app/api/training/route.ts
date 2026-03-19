import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { trainingRateLimit } from '@/lib/rate-limit';
import {
  parsePython,
  parseTypeScript,
  generateDataset,
  toJsonl
} from '@/lib/training/parser';
import { getOrCreateCompanyForUser } from '@/lib/company';
import {
  checkAndConsumeQuota,
  DemoExpiredError,
  QuotaExhaustedError
} from '@/lib/demo-quota';

interface FileEntry {
  name: string;
  download_url: string;
}

async function fetchGitHubFiles(repoUrl: string): Promise<FileEntry[]> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');

  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;

  const res = await fetch(apiUrl, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  });
  if (!res.ok) {
    const fallbackRes = await fetch(apiUrl.replace('/main?', '/master?'), {
      headers: { Accept: 'application/vnd.github.v3+json' }
    });
    if (!fallbackRes.ok) throw new Error('Failed to fetch repository tree');
    const fallbackData = await fallbackRes.json();
    return filterSourceFiles(
      fallbackData.tree,
      owner,
      repo as string,
      'master'
    );
  }

  const data = await res.json();
  return filterSourceFiles(data.tree, owner, repo as string, 'main');
}

function filterSourceFiles(
  tree: { path: string; type: string }[],
  owner: string,
  repo: string,
  branch: string
): FileEntry[] {
  return tree
    .filter(
      (f) =>
        f.type === 'blob' &&
        (f.path.endsWith('.py') ||
          f.path.endsWith('.ts') ||
          f.path.endsWith('.tsx')) &&
        !f.path.includes('node_modules') &&
        !f.path.includes('__pycache__') &&
        !f.path.includes('.test.') &&
        !f.path.includes('.spec.')
    )
    .slice(0, 50)
    .map((f) => ({
      name: f.path,
      download_url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${f.path}`
    }));
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { success } = await trainingRateLimit.limit(userId);
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded (5/hr)' },
      { status: 429 }
    );
  }

  // Quota check
  try {
    const user = await currentUser();
    if (user) {
      const company = await getOrCreateCompanyForUser(user);
      await checkAndConsumeQuota(company.companyId, 'training', userId);
    }
  } catch (err) {
    if (err instanceof DemoExpiredError) {
      return NextResponse.json({ code: 'DEMO_EXPIRED' }, { status: 403 });
    }
    if (err instanceof QuotaExhaustedError) {
      return NextResponse.json({ code: 'QUOTA_EXHAUSTED' }, { status: 403 });
    }
  }

  const body = await req.json();
  const { github_url, strategy = 'explain-function' } = body as {
    github_url?: string;
    strategy?: 'explain-function' | 'write-docstring';
  };

  if (!github_url) {
    return NextResponse.json(
      { error: 'github_url is required' },
      { status: 400 }
    );
  }

  try {
    const files = await fetchGitHubFiles(github_url);
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No source files found in repository' },
        { status: 400 }
      );
    }

    const allFunctions = [];
    for (const file of files) {
      const res = await fetch(file.download_url);
      if (!res.ok) continue;
      const source = await res.text();
      const parsed = file.name.endsWith('.py')
        ? parsePython(source)
        : parseTypeScript(source);
      allFunctions.push(...parsed);
    }

    if (allFunctions.length === 0) {
      return NextResponse.json(
        { error: 'No functions found to generate dataset from' },
        { status: 400 }
      );
    }

    const rows = generateDataset(allFunctions, strategy);
    const jsonl = toJsonl(rows);

    const fileName = `dataset-${Date.now()}.jsonl`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('datasets')
      .upload(fileName, Buffer.from(jsonl), {
        contentType: 'application/jsonl'
      });

    if (uploadError) {
      return NextResponse.json({
        dataset_inline: jsonl,
        record_count: rows.length,
        note: 'Storage upload failed, returning inline'
      });
    }

    const { data: urlData } = await supabaseAdmin.storage
      .from('datasets')
      .createSignedUrl(fileName, 3600);

    await supabaseAdmin.from('datasets').insert({
      user_id: userId,
      name: fileName,
      source_type: 'github',
      source_url: github_url,
      storage_path: fileName,
      format: 'jsonl_sft',
      record_count: rows.length
    });

    return NextResponse.json({
      download_url: urlData?.signedUrl || null,
      record_count: rows.length,
      files_processed: files.length,
      functions_found: allFunctions.length
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
