#!/usr/bin/env node
/**
 * Syncs SaaS projects from Vercel team into:
 *   - src/data/saas-projects.json  (metadata)
 *   - public/saas-screenshots/     (PNG screenshots)
 *
 * Required env:
 *   VERCEL_TOKEN   — Vercel API token
 *   VERCEL_TEAM_ID — Vercel team ID
 *   GH_PAT         — GitHub PAT with repo scope (for private repo descriptions)
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_ZhpfIRsiAC6e9byWX1PtUELx';
const GH_PAT = process.env.GH_PAT;
const GH_ORG = process.env.GH_ORG || 'code-shame';

if (!VERCEL_TOKEN) throw new Error('VERCEL_TOKEN is required');

// --- Vercel API helpers ---

async function vercelGet(path) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `https://api.vercel.com${path}${sep}teamId=${VERCEL_TEAM_ID}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Vercel API ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function fetchAllProjects() {
  const projects = [];
  let until = null;

  while (true) {
    const qs = until ? `?limit=100&until=${until}` : '?limit=100';
    const data = await vercelGet(`/v9/projects${qs}`);
    projects.push(...data.projects);
    if (!data.pagination?.next) break;
    until = data.pagination.next;
  }

  return projects;
}

// --- GitHub API helper ---

async function fetchGithubRepoDescription(repoId) {
  if (!GH_PAT || !repoId) return '';
  try {
    const res = await fetch(`https://api.github.com/repositories/${repoId}`, {
      headers: {
        Authorization: `Bearer ${GH_PAT}`,
        Accept: 'application/vnd.github+json'
      }
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.description || '';
  } catch {
    return '';
  }
}

// --- Production URL from Vercel project ---

function getProductionUrl(project) {
  // Prefer aliases with target === 'production', else first alias
  const aliases = project.alias || [];
  const prod = aliases.find((a) => a.target === 'production');
  const domain = prod?.domain || aliases[0]?.domain;
  if (!domain) return null;
  return `https://${domain}`;
}

// --- Main ---

async function main() {
  console.log('Fetching Vercel projects…');
  const allProjects = await fetchAllProjects();
  console.log(`Found ${allProjects.length} total projects`);

  const orgProjects = allProjects.filter((p) => {
    const repo = p.link?.repo || '';
    const isOrgRepo = repo.startsWith(`${GH_ORG}/`) || p.link?.org === GH_ORG;
    const isProdDeployed = p.targets?.production?.readyState === 'READY';
    return isOrgRepo && isProdDeployed;
  });
  console.log(`Filtered to ${orgProjects.length} production-deployed projects from ${GH_ORG} org`);

  const screenshotsDir = join(ROOT, 'public', 'saas-screenshots');
  mkdirSync(screenshotsDir, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const project of orgProjects) {
    const url = getProductionUrl(project);
    if (!url) {
      console.log(`  [skip] ${project.name} — no production alias`);
      continue;
    }

    const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const screenshotFile = `${slug}.png`;
    const screenshotPath = `/saas-screenshots/${screenshotFile}`;
    const screenshotDisk = join(screenshotsDir, screenshotFile);

    console.log(`  [screenshot] ${project.name} → ${url}`);
    try {
      const page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.screenshot({ path: screenshotDisk, type: 'png' });
      await page.close();
    } catch (err) {
      console.warn(`    screenshot failed: ${err.message}`);
      // Skip this project if screenshot fails
      continue;
    }

    const repoId = project.link?.repoId;
    const description = await fetchGithubRepoDescription(repoId);

    results.push({
      slug,
      name: project.name,
      description,
      url,
      screenshotPath,
      updatedAt: new Date().toISOString()
    });
  }

  await browser.close();

  const outPath = join(ROOT, 'src', 'data', 'saas-projects.json');
  writeFileSync(outPath, JSON.stringify(results, null, 2) + '\n');
  console.log(`Wrote ${results.length} projects to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
