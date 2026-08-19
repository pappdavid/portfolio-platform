import { getEvidenceManifest } from '@/lib/voidarch/architecture';

export function GET() {
  return Response.json(getEvidenceManifest(), {
    headers: {
      'cache-control': 'public, max-age=300, stale-while-revalidate=3600'
    }
  });
}
