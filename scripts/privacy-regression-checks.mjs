import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { createHash, randomUUID } from 'node:crypto';

let writes = 0;
let rpcCalls = [];
let sets = [];
class Response {
  constructor(data, status = 200) {
    this.data = data;
    this.status = status;
    this.headers = new Headers();
    this.cookies = {
      delete() {},
      set(...args) {
        sets.push(args);
      }
    };
  }
  static redirect(url) {
    return new Response({ url: String(url) }, 307);
  }
  static json(data, options) {
    return new Response(data, options?.status || 200);
  }
}
const admin = {
  from() {
    return {
      select() {
        return this;
      },
      eq() {
        return this;
      },
      async maybeSingle() {
        return { data: { id: 'internal' } };
      },
      async single() {
        return { data: { id: 'internal' } };
      },
      async insert() {
        writes++;
        return {};
      }
    };
  },
  async rpc(name, args) {
    rpcCalls.push({ name, args });
    return { data: true };
  }
};
function load(file) {
  const source = fs.readFileSync(file, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const exports = {};
  const require = (name) => {
    if (name === 'next/server') return { NextResponse: Response };
    if (name === 'crypto') return { createHash, randomUUID };
    if (name.includes('supabase/admin')) return { supabaseAdmin: admin };
    if (name.includes('rate-limit'))
      return {
        refVisitRateLimit: {
          async limit() {
            return { success: true };
          }
        }
      };
    if (name.includes('ref-events-retention'))
      return { async purgeExpiredRefEvents() {} };
    if (name.includes('referral-personalization'))
      return { REFERRAL_COOKIE: 'dp_ref' };
    throw new Error('Unexpected import: ' + name);
  };
  new Function('require', 'exports', output)(require, exports);
  return exports;
}
const route = load(
  process.env.PRIVACY_BASELINE_ROUTE || 'src/app/r/[token]/route.ts'
);
const request = new Request('https://example.test/r/6a65546f72a19516', {
  headers: { 'x-forwarded-for': '2001:db8::1', 'user-agent': 'INTERNAL TEST' }
});
const result = await route.GET(request, {
  params: Promise.resolve({ token: '6a65546f72a19516' })
});
assert.equal(writes, 0, 'opening a link must never write a visitor event');
assert.equal(sets.length, 0, 'opening a link must never set a referral cookie');
assert.equal(
  new URL(result.data.url).searchParams.get('ref'),
  '6a65546f72a19516'
);
console.log(
  'PASS native link opening: personalization, no cookie, no visitor record'
);

const consent = load('src/app/api/ref/visit/route.ts');
const req = (body, origin = 'https://example.test') =>
  new Request('https://example.test/api/ref/visit', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
assert.equal(
  (await consent.POST(req({ action: 'count', token: '6a65546f72a19516' })))
    .status,
  400
);
assert.equal(rpcCalls.length, 0);
assert.equal(
  (
    await consent.POST(
      req(
        { action: 'count', consent: true, token: '6a65546f72a19516' },
        'https://other.test'
      )
    )
  ).status,
  403
);
const allowed = await consent.POST(
  req({ action: 'count', consent: true, token: '6a65546f72a19516' })
);
assert.equal(allowed.status, 200);
assert.equal(rpcCalls[0].name, 'count_referral_with_consent');
assert.equal(Object.keys(rpcCalls[0].args).length, 2);
assert.match(rpcCalls[0].args.p_receipt_hash, /^[a-f0-9]{64}$/);
assert.notEqual(rpcCalls[0].args.p_receipt_hash, allowed.data.receipt);
assert.equal(
  (
    await consent.POST(
      req({ action: 'withdraw', receipt: allowed.data.receipt })
    )
  ).status,
  200
);
assert.equal(rpcCalls[1].name, 'withdraw_referral_count');
console.log(
  'PASS explicit consent required, cross-origin rejected, withdrawal hashes receipt'
);
