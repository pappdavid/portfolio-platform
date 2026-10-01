/** Document URL that keeps Vite relative assets under /demos/<slug>/assets/. */
export function demoIframeSrc(
  slug: string,
  roleId?: string | null,
  search = ''
): string {
  const params = new URLSearchParams();
  if (roleId) params.set('role', roleId);
  const context = new URLSearchParams(search);
  const ref = context.get('ref');
  const company = context.get('c');
  if (ref && /^[a-f0-9]{16}$/.test(ref)) params.set('ref', ref);
  if (company && /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$/.test(company)) {
    params.set('c', company);
  }
  const qs = params.toString();
  return `/demos/${slug}/index.html${qs ? `?${qs}` : ''}`;
}
