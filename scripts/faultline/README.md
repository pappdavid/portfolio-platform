# Faultline showcase

Open `/faultline/index.html`. The showcase is a self-contained static module in
`public/faultline`; it adds no dependencies and never calls an external service.

## Verify

- Unit/state invariants: `node --test scripts/faultline/engine.test.mjs`
- Serve static assets: `python3 -m http.server 4173 --directory public`
- Open `http://localhost:4173/faultline/index.html` in a browser.
- Default path: send (1 visit / no confirmation), retry (2 visits / uniqueness fails),
  apply fix (1 visit / both assertions pass). Retry again and probe changed payload.
- Cover all three faults, changed keys, multiple retries, reset and JSON export.
- Run repository lint, typecheck, build and content checks before publication.

## Honesty boundary

This is an executable deterministic model, not a durable service. The booking is
seeded. Receiver state is in browser memory, isolated per tab/run, and resets on
reload. A synchronous receiver transition models one atomic transaction that
creates a visit and saves its idempotency receipt together. There is no await or
interleaving inside that transition. Production receivers need a transactional
unique constraint, tenant/operation key scoping, validation, recovery, and an
explicit receipt retention policy. No arbitrary-provider exactly-once claim is made.

The fixed receiver stores the request fingerprint and result under the operation
key. A retry with the same body returns that result; a different body is rejected
with 409. An unstable client key intentionally defeats deduplication. Before-commit
and no-fault controls separate transport uncertainty from receiver behavior.

Trace JSON contains the actual executed model state, computed assertions, and its
scope limitations. Baseline and fixed results are independent runs of the same
fixture, not migration or cleanup of already-created visits.
