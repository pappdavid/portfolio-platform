import records from '../../data/application-proofs.json';

export function resolveProofReferral(
  company: string,
  notes: string | null
): string | null {
  if (!notes) return null;
  try {
    const envelope: unknown = JSON.parse(notes);
    if (!envelope || typeof envelope !== 'object') return null;
    const value = envelope as Record<string, unknown>;
    if (
      value.v !== 1 ||
      !value.personalization ||
      typeof value.personalization !== 'object'
    )
      return null;
    const snapshot = value.personalization as Record<string, unknown>;
    const record = records.find(
      (entry) => entry.applicationId === snapshot.applicationId
    );
    if (
      !record ||
      company !== record.company ||
      snapshot.company !== record.company ||
      snapshot.role !== record.role
    )
      return null;
    return '/application-proofs/' + record.key;
  } catch {
    return null;
  }
}
