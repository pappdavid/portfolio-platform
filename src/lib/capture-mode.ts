/**
 * Deterministic capture mode for evidence screenshots.
 *
 * Active when the URL carries `?capture=1` OR the visitor prefers
 * reduced motion. In capture mode every decorative animation renders in
 * its FINAL state immediately (no typewriter race, no requestAnimationFrame
 * loop, no CRT flicker, no randomized SIM status values) so consecutive
 * screenshots are byte-stable.
 *
 * Role-based content variation (heroRole, demo order via job-type.ts) is
 * NOT affected — that variation is by design.
 */
export function isCaptureMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  // Only an explicit truthy value enables capture; ?capture=0 is OFF so the
  // flag can never be accidentally vacuous-on.
  const v = params.get('capture');
  if (v !== null && v !== '0' && v !== 'false') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Mark the document so CSS can freeze every animation/transition for the
 * whole tree. Called once from the landing content mount effect.
 */
export function applyCaptureAttribute(): void {
  if (typeof document === 'undefined') return;
  if (isCaptureMode()) {
    document.documentElement.setAttribute('data-capture', '1');
  }
}
