import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fixture,
  scenarios,
  totalFrames,
  validateSnapshot,
  transition,
  pruneStaleNodes
} from '../public/demos/mercury/engine.mjs';
test('all 48 synthetic snapshots match schema', () => {
  for (const key of Object.keys(scenarios))
    for (let i = 0; i < totalFrames; i++)
      assert.equal(validateSnapshot(fixture(key, i)).version, 1);
});
test('node IDs persist while labels and graph refine', () => {
  const a = validateSnapshot(fixture('atlas', 0)),
    b = validateSnapshot(fixture('atlas', 15));
  assert.deepEqual(
    a.nodes.map((n) => n.id),
    b.nodes.map((n) => n.id)
  );
  assert.notEqual(a.title, b.title);
  assert(b.edges.length > a.edges.length);
});
test('malformed frame retains last valid composition', () => {
  const s = transition(
    { page: null, accepted: 0, rejected: 0 },
    fixture('atlas', 5)
  );
  const failed = transition(s, '{"version":1');
  assert.equal(failed.page, s.page);
  assert.equal(failed.rejected, 1);
  assert.equal(failed.accepted, 1);
  assert(failed.error);
});
test('reject invalid color, oversized content, coordinate, duplicate ID and edge index', () => {
  for (const edit of [
    (s) => (s.color = 'url(https://evil.test)'),
    (s) => (s.title = 'x'.repeat(101)),
    (s) => (s.nodes[0].x = Infinity),
    (s) => (s.nodes[0].id = s.nodes[1].id),
    (s) => (s.edges = [[0, 9]]),
    (s) => (s.phase = -1)
  ]) {
    const s = JSON.parse(fixture('orbit', 3));
    edit(s);
    assert.throws(() => validateSnapshot(JSON.stringify(s)));
  }
});
test('reject null, arrays, nonstring and excessive input', () => {
  for (const v of ['null', '[]', null, 'x'.repeat(20001), '{}'])
    assert.throws(() => validateSnapshot(v));
});
test('valid frame after rejection resumes without corrupting counters', () => {
  let s = { page: null, accepted: 0, rejected: 0 };
  s = transition(s, fixture('signal', 0));
  s = transition(s, 'bad');
  s = transition(s, fixture('signal', 15));
  assert.equal(s.accepted, 2);
  assert.equal(s.rejected, 1);
  assert.equal(s.error, null);
  assert.equal(s.page.phase, 100);
});
test('HTML is data, never executed by the engine', () => {
  const s = JSON.parse(fixture('atlas', 0));
  s.title = '<img src=x onerror=alert(1)>';
  assert.equal(validateSnapshot(JSON.stringify(s)).title, s.title);
});

test('full-state replacement removes every adjacent stale SVG node', () => {
  const backing = [];
  for (const id of ['stale-a', 'stale-b', 'keep', 'stale-c']) {
    const node = {
      getAttribute: () => id,
      remove: () => backing.splice(backing.indexOf(node), 1)
    };
    backing.push(node);
  }
  // Array's iterator is live, as is an HTMLCollection iterator.
  pruneStaleNodes(backing, new Set(['keep']));
  assert.deepEqual(
    backing.map((node) => node.getAttribute()),
    ['keep']
  );
});
