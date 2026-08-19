export type KnowledgeKind =
  | 'profile'
  | 'work'
  | 'experience'
  | 'project'
  | 'skills'
  | 'scope';
export type KnowledgeDoc = {
  id: string;
  title: string;
  kind: KnowledgeKind;
  text: string;
  tags: string[];
  href?: string;
};
export type KnowledgeHit = { doc: KnowledgeDoc; score: number };
type ProjectRecord = {
  id?: string;
  name: string;
  description: string;
  techStack: string[];
  keyFeatures: string[];
  architecture: string;
  fileStructure: string[];
  details: string;
};

const STOP = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'into',
  'his',
  'her',
  'are',
  'was',
  'were',
  'what',
  'why',
  'how',
  'who',
  'does',
  'did',
  'about',
  'david'
]);
const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
function tokens(value: string): string[] {
  return (
    value
      .toLowerCase()
      .replace(/machine learning/g, ' machinelearning ml ')
      .replace(/large language models?/g, ' llm ')
      .replace(/artificial intelligence/g, ' ai ')
      .replace(
        /work authori[sz]ation/g,
        ' workauthorization permit sponsorship '
      )
      .match(/[a-z0-9][a-z0-9+.#/-]*/g)
      ?.filter((token) => token.length > 1 && !STOP.has(token)) ?? []
  );
}
function sectionKind(title: string): KnowledgeKind {
  const t = title.toLowerCase();
  if (t.includes('professional')) return 'work';
  if (t.includes('earlier')) return 'experience';
  if (t.includes('tech stack')) return 'skills';
  if (t.includes('project scope')) return 'scope';
  if (t.includes('selected engineering')) return 'project';
  return 'profile';
}
const sectionHref = (kind: KnowledgeKind) =>
  kind === 'skills'
    ? '/#skills'
    : kind === 'project' || kind === 'scope'
      ? '/#work'
      : '/cv.pdf';

export function buildPortfolioKnowledgeBase(
  corpus: string,
  projects: ProjectRecord[]
): KnowledgeDoc[] {
  const sections = corpus
    .split(/\n# /)
    .map((part) => part.replace(/^# /, '').trim())
    .filter(Boolean)
    .map((part) => {
      const [title, ...body] = part.split('\n');
      const kind = sectionKind(title);
      return {
        id: `profile-${slug(title)}`,
        title,
        kind,
        text: body.join('\n').trim(),
        tags: tokens(title),
        href: sectionHref(kind)
      } satisfies KnowledgeDoc;
    });
  const projectDocs = projects
    .filter((project) => project.name !== 'About David Papp')
    .map((project) => ({
      id: `project-${project.id || slug(project.name)}`,
      title: project.name,
      kind: 'project' as const,
      text: [
        project.description,
        `Tech stack: ${project.techStack.join(', ')}`,
        `Key features: ${project.keyFeatures.join('; ')}`,
        `Architecture: ${project.architecture}`,
        project.fileStructure.length
          ? `Files: ${project.fileStructure.join(', ')}`
          : '',
        `Details: ${project.details}`
      ]
        .filter(Boolean)
        .join('\n'),
      tags: [
        ...tokens(project.name),
        ...project.techStack.flatMap(tokens),
        ...project.keyFeatures.flatMap(tokens)
      ],
      href:
        project.name === 'AgentSec Suite'
          ? 'https://promptshield-cyan.vercel.app'
          : '/#work'
    }));
  return [...sections, ...projectDocs];
}

export function retrieveKnowledge(
  query: string,
  docs: readonly KnowledgeDoc[],
  topK = 4,
  options: { pinnedTitles?: string[] } = {}
): KnowledgeHit[] {
  const q = tokens(query);
  if (!docs.length || !q.length) return [];
  const searchable = docs.map((doc) => {
    const title = tokens(doc.title);
    return {
      doc,
      all: [...title, ...title, ...doc.tags, ...doc.tags, ...tokens(doc.text)]
    };
  });
  const avgLen =
    searchable.reduce((sum, item) => sum + item.all.length, 0) /
    searchable.length;
  const df = new Map<string, number>();
  for (const term of Array.from(new Set(q)))
    df.set(term, searchable.filter((item) => item.all.includes(term)).length);
  const pinRank = new Map(
    (options.pinnedTitles || []).map((title, index) => [
      title.toLowerCase(),
      index
    ])
  );
  const k1 = 1.2,
    b = 0.75;
  return searchable
    .map(({ doc, all }) => {
      const counts = new Map<string, number>();
      all.forEach((term) => counts.set(term, (counts.get(term) || 0) + 1));
      let score = 0;
      for (const term of q) {
        const n = df.get(term) || 0;
        if (!n) continue;
        const idf = Math.log(1 + (docs.length - n + 0.5) / (n + 0.5));
        const tf = counts.get(term) || 0;
        score +=
          idf *
          ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (all.length / avgLen))));
      }
      const pin = pinRank.get(doc.title.toLowerCase());
      if (pin !== undefined) score += 100 - pin;
      return { doc, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, bHit) => bHit.score - a.score)
    .slice(0, topK);
}

export const formatKnowledgeContext = (hits: readonly KnowledgeHit[]) =>
  hits
    .map(
      (hit) => `[Source: ${hit.doc.title} | ${hit.doc.kind}]\n${hit.doc.text}`
    )
    .join('\n\n---\n\n');
export const toEvidenceItems = (hits: readonly KnowledgeHit[]) =>
  hits.map(({ doc, score }) => ({
    id: doc.id,
    title: doc.title,
    kind: doc.kind,
    summary: doc.text.replace(/\s+/g, ' ').slice(0, 220),
    href: doc.href,
    score: Math.round(score * 100) / 100
  }));
