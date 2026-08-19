import assert from 'node:assert/strict';
import test from 'node:test';

async function loadArchitecture(): Promise<Record<string, unknown>> {
  try {
    return (await import('./architecture.ts')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

test('VoidArch architecture exposes eight unique subsystem nodes', async () => {
  const mod = await loadArchitecture();
  const nodes = mod.VOIDARCH_NODES as
    | Array<{ id: string; group: string }>
    | undefined;
  assert.ok(Array.isArray(nodes), 'VOIDARCH_NODES should exist');
  assert.equal(nodes.length, 8);
  assert.equal(new Set(nodes.map((node) => node.id)).size, 8);
  assert.deepEqual(
    nodes
      .filter((node) => node.group === 'core')
      .map((node) => node.id)
      .sort(),
    ['context', 'router', 'studio']
  );
});

test('all subsystem maturity values use the public maturity taxonomy', async () => {
  const mod = await loadArchitecture();
  const nodes = mod.VOIDARCH_NODES as Array<{ maturity: string }> | undefined;
  assert.ok(Array.isArray(nodes), 'VOIDARCH_NODES should exist');
  const allowed = new Set([
    'WORKING',
    'ACTIVE',
    'PROTOTYPE',
    'PLANNED',
    'FUTURE',
    'EXTERNAL'
  ]);
  for (const node of nodes)
    assert.ok(allowed.has(node.maturity), node.maturity);
});

test('all graph edges reference valid subsystem nodes', async () => {
  const mod = await loadArchitecture();
  const nodes = mod.VOIDARCH_NODES as Array<{ id: string }> | undefined;
  const edges = mod.VOIDARCH_EDGES as
    | Array<{ source: string; target: string }>
    | undefined;
  assert.ok(Array.isArray(nodes), 'VOIDARCH_NODES should exist');
  assert.ok(Array.isArray(edges), 'VOIDARCH_EDGES should exist');
  const ids = new Set(nodes.map((node) => node.id));
  for (const edge of edges) {
    assert.ok(ids.has(edge.source), `unknown source ${edge.source}`);
    assert.ok(ids.has(edge.target), `unknown target ${edge.target}`);
  }
});

test('Context, Router, and Studio each expose evidence paths', async () => {
  const mod = await loadArchitecture();
  const evidence = mod.VOIDARCH_EVIDENCE as
    | Record<string, unknown[]>
    | undefined;
  assert.ok(evidence, 'VOIDARCH_EVIDENCE should exist');
  for (const id of ['context', 'router', 'studio']) {
    assert.ok(Array.isArray(evidence[id]), `${id} evidence should be an array`);
    assert.ok(
      evidence[id].length >= 3,
      `${id} should expose at least three evidence paths`
    );
  }
});

test('Hermes is described only as an external testbed or integration surface', async () => {
  const mod = await loadArchitecture();
  const text = JSON.stringify(mod).toLowerCase();
  assert.match(text, /hermes/);
  assert.match(text, /external/);
  assert.match(text, /testbed|integration surface/);
  assert.doesNotMatch(text, /hermes[^.]{0,80}(core|owned by voidarch)/);
});
