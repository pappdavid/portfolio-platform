const SUPPORTED_ROLES = new Set([
  'ai-engineering',
  'ai-integration',
  'automation',
  'product-engineering'
]);

const TASK_FLOW_RESULT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const isTaskFlowResultId = (value: unknown): value is string =>
  typeof value === 'string' && TASK_FLOW_RESULT_ID.test(value);

/** Document URL that keeps Vite assets under /demos/<slug>/assets/. */
export function demoIframeSrc(
  slug: string,
  roleId?: string | null,
  search = '',
  resultId?: string | null
): string {
  const params = new URLSearchParams();
  if (roleId && SUPPORTED_ROLES.has(roleId)) params.set('role', roleId);
  const context = new URLSearchParams(search);
  const ref = context.get('ref');
  const company = context.get('c');
  if (ref && /^[a-f0-9]{16}$/.test(ref)) params.set('ref', ref);
  if (company && /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$/.test(company)) {
    params.set('c', company);
  }
  const qs = params.toString();
  const resultHash =
    slug === 'task-to-flow' && isTaskFlowResultId(resultId)
      ? `#implementation/${resultId}`
      : '';
  return `/demos/${slug}/index.html${qs ? `?${qs}` : ''}${resultHash}`;
}

/** Full-page continuation keeps the opaque result ID in query and fragment. */
export function demoFullPageHref(
  slug: string,
  roleId?: string | null,
  search = '',
  resultId?: string | null
): string {
  const src = demoIframeSrc(slug, roleId, search, resultId);
  if (slug !== 'task-to-flow' || !isTaskFlowResultId(resultId)) return src;

  const hashIndex = src.indexOf('#');
  const pathAndQuery = hashIndex < 0 ? src : src.slice(0, hashIndex);
  const hash = hashIndex < 0 ? '' : src.slice(hashIndex);
  const separator = pathAndQuery.includes('?') ? '&' : '?';
  return `${pathAndQuery}${separator}result=${resultId}${hash}`;
}

/** Parent-page fragment contains only the opaque result ID, never user text. */
export function taskFlowResultHash(resultId: string): string {
  return isTaskFlowResultId(resultId) ? `#task-to-flow-result/${resultId}` : '';
}

export function parseTaskFlowResultHash(hash: string): string | null {
  const match = /^#task-to-flow-result\/(.*)$/.exec(hash);
  return match && isTaskFlowResultId(match[1]) ? match[1] : null;
}

/** Validates the source-side postMessage shape before accepting an ID. */
export function taskFlowResultIdFromMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const message = data as { type?: unknown; resultId?: unknown };
  return message.type === 'task-to-flow-result' &&
    isTaskFlowResultId(message.resultId)
    ? message.resultId
    : null;
}
