import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const records = JSON.parse(
  fs.readFileSync('src/data/application-proofs.json', 'utf8')
);
const source = fs.readFileSync(
  'src/features/application-proofs/referral.ts',
  'utf8'
);
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true }
}).outputText;
const exported = { exports: {} };
vm.runInNewContext(output, {
  exports: exported.exports,
  module: exported,
  require: () => records
});
const { resolveProofReferral } = exported.exports;
assert.equal(records.length, 5);
for (const record of records) {
  const notes = JSON.stringify({
    v: 1,
    personalization: {
      company: record.company,
      role: record.role,
      applicationId: record.applicationId
    }
  });
  assert.equal(
    resolveProofReferral(record.company, notes),
    '/application-proofs/' + record.key
  );
  assert.equal(resolveProofReferral('Unrelated employer', notes), null);
  assert.equal(
    resolveProofReferral(
      record.company,
      notes.replace(record.role, 'Different role')
    ),
    null
  );
  assert.equal(
    resolveProofReferral(
      record.company,
      notes.replace(record.applicationId, 'https://attacker.example/')
    ),
    null
  );
  assert.equal(
    resolveProofReferral(
      record.company,
      JSON.stringify({
        v: 2,
        personalization: {
          company: record.company,
          role: record.role,
          applicationId: record.applicationId
        }
      })
    ),
    null
  );
  const text = JSON.stringify(record);
  assert.doesNotMatch(
    text,
    /PromptShield|MCPGuard|40%|20\\+|two ERP|spatial-mockup|ChurnAutopsy|TechDebtLedger|ProposalSpy/i
  );
  assert.equal(
    record.projects.find((p) => p.title === 'Client Studio').url,
    'https://client-studio-psi.vercel.app/'
  );
  assert.ok(record.education.status.includes('2028'));
}
for (const notes of [
  null,
  '',
  'not json',
  '{}',
  '{"v":1}',
  '{"v":1,"personalization":{"applicationId":"legacy"}}'
]) {
  assert.equal(resolveProofReferral('Workwize', notes), null);
}
const page = fs.readFileSync(
  'src/app/application-proofs/[key]/page.tsx',
  'utf8'
);
assert.doesNotMatch(page, /LandingContent|api\/chat|JOB_TYPES/);
for (const anchor of [
  'commercial-recovery',
  'personal-projects',
  'process-handoffs',
  'education',
  'sources'
])
  assert.ok(page.includes("id='" + anchor + "'"));
assert.equal(records[0].projects[0].id, 'client-studio');
assert.equal(records[0].projects[1].id, 'voidarch-context');
console.log(
  'Application proof routing, legacy fallback, scope and content checks passed'
);
