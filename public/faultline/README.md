# Faultline

Executable browser model of retries and idempotency: lose the request before commit or the response after it, see the duplicate effect of a naive retry, then replay against an idempotent receiver. The receiver stores the operation key and payload fingerprint and rejects a changed payload under the same key.

- Live: https://davidpapp.dev/faultline/index.html
- Engine: [`engine.mjs`](engine.mjs) · UI: [`app.mjs`](app.mjs)
- Tests and the honesty boundary: [`scripts/faultline/`](../../scripts/faultline/), run in CI by `npm run test:showcases`

Atomic effect-and-receipt storage is a model assumption. It is a teaching model in browser JavaScript, not a deployed service or a test of real distributed systems.
