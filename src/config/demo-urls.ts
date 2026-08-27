/** Document URL that keeps Vite relative assets under /demos/<slug>/assets/. */
export function demoIframeSrc(
  slug: string,
  roleId?: string | null
): string {
  const params = new URLSearchParams();
  if (roleId) params.set('role', roleId);
  const qs = params.toString();
  return `/demos/${slug}/index.html${qs ? `?${qs}` : ''}`;
}
