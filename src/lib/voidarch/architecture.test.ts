import assert from 'node:assert/strict';
import test from 'node:test';

async function loadArchitecture(): Promise<Record<string, unknown>> {
  try {
    // @ts-expect-error Node's native TypeScript test runner requires the explicit .ts extension.
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

test('architecture manifest is serializable and exposes nodes, edges, and maturity legend', async () => {
  const mod = await loadArchitecture();
  assert.equal(typeof mod.getArchitectureManifest, 'function');
  const manifest = (mod.getArchitectureManifest as () => unknown)() as {
    name: string;
    maturityLegend: string[];
    nodes: unknown[];
    edges: unknown[];
  };
  assert.equal(manifest.name, 'VoidArch');
  assert.equal(manifest.nodes.length, 8);
  assert.ok(manifest.edges.length >= 8);
  assert.deepEqual(manifest.maturityLegend, [
    'WORKING',
    'ACTIVE',
    'PROTOTYPE',
    'PLANNED',
    'FUTURE',
    'EXTERNAL'
  ]);
  assert.doesNotThrow(() => JSON.stringify(manifest));
});

test('evidence manifest is serializable and groups evidence by core subsystem', async () => {
  const mod = await loadArchitecture();
  assert.equal(typeof mod.getEvidenceManifest, 'function');
  const manifest = (mod.getEvidenceManifest as () => unknown)() as {
    name: string;
    evidence: Record<string, unknown[]>;
  };
  assert.equal(manifest.name, 'VoidArch');
  assert.deepEqual(Object.keys(manifest.evidence).sort(), [
    'context',
    'router',
    'studio'
  ]);
  assert.doesNotThrow(() => JSON.stringify(manifest));
});

test('each subsystem owns a stable world coordinate and inspector detail', async () => {
  const mod = await loadArchitecture();
  const nodes = mod.VOIDARCH_NODES as Array<{
    position?: { x: number; y: number };
    role?: string;
    owns?: string;
    connects?: string;
    bullets?: string[];
  }>;
  for (const node of nodes) {
    assert.ok(node.position, 'node position should exist');
    assert.ok(Number.isFinite(node.position?.x));
    assert.ok(Number.isFinite(node.position?.y));
    assert.ok((node.position?.x ?? 0) >= 0 && (node.position?.x ?? 0) <= 1600);
    assert.ok((node.position?.y ?? 0) >= 0 && (node.position?.y ?? 0) <= 900);
    assert.ok(node.role && node.owns && node.connects);
    assert.ok(Array.isArray(node.bullets) && node.bullets.length >= 2);
  }
});

test('canonical research route references valid nodes and edges and ends in evidence', async () => {
  const mod = await loadArchitecture();
  const nodes = mod.VOIDARCH_NODES as Array<{ id: string }>;
  const edges = mod.VOIDARCH_EDGES as Array<{ id: string }>;
  const route = mod.VOIDARCH_RESEARCH_ROUTE as
    | Array<{ node: string; edge?: string }>
    | undefined;
  assert.ok(Array.isArray(route));
  assert.equal(route[0]?.node, 'context');
  assert.equal(route.at(-1)?.node, 'evidence');
  assert.ok(route.some((step) => step.node === 'router'));
  assert.ok(route.some((step) => step.node === 'studio'));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeIds = new Set(edges.map((edge) => edge.id));
  for (const step of route) {
    assert.ok(nodeIds.has(step.node), step.node);
    if (step.edge) assert.ok(edgeIds.has(step.edge), step.edge);
  }
});

test('project spine exposes concrete core and supporting implementations', async () => {
  const mod = await loadArchitecture();
  const projects = mod.VOIDARCH_PROJECTS as
    | Array<{
        id: string;
        visibility: string;
        implemented: string[];
        verification: string[];
      }>
    | undefined;
  assert.ok(Array.isArray(projects), 'VOIDARCH_PROJECTS should exist');
  const ids = new Set(projects.map((project) => project.id));
  for (const id of ['context', 'router', 'studio', 'agentsec', 'saas-core']) {
    assert.ok(ids.has(id), `missing project ${id}`);
  }
  for (const project of projects) {
    assert.ok(
      project.implemented.length >= 3,
      `${project.id} needs concrete implementation facts`
    );
    assert.ok(
      project.verification.length >= 1,
      `${project.id} needs verification evidence`
    );
  }
  assert.equal(
    projects.find((project) => project.id === 'router')?.visibility,
    'private'
  );
});

test('core project data contains repository-specific implementation facts', async () => {
  const mod = await loadArchitecture();
  const text = JSON.stringify(mod.VOIDARCH_PROJECTS);
  for (const fact of [
    'SurrealKV',
    'BM25',
    'Tree-sitter',
    'PreparedContextRequest',
    'daemon-owned PTY',
    'WebSocket',
    'Tauri',
    'requires_approval'
  ])
    assert.match(text, new RegExp(fact, 'i'), fact);
});

test('applied lab signals connect experiments to extracted infrastructure primitives', async () => {
  const mod = await loadArchitecture();
  const signals = mod.VOIDARCH_LAB_SIGNALS as
    | Array<{
        domain: string;
        recurringSystems: string;
        extractedPrimitive: string;
      }>
    | undefined;
  assert.ok(Array.isArray(signals), 'VOIDARCH_LAB_SIGNALS should exist');
  assert.ok(signals.length >= 6);
  const text = JSON.stringify(signals).toLowerCase();
  for (const term of [
    'code review',
    'documentation',
    'scope',
    'technical debt',
    'cloud',
    'proposal'
  ]) {
    assert.match(text, new RegExp(term));
  }
});

test('architecture manifest includes project provenance and lab signals', async () => {
  const mod = await loadArchitecture();
  const manifest = (mod.getArchitectureManifest as () => unknown)() as {
    projects?: unknown[];
    labSignals?: unknown[];
  };
  assert.ok(Array.isArray(manifest.projects) && manifest.projects.length >= 5);
  assert.ok(
    Array.isArray(manifest.labSignals) && manifest.labSignals.length >= 6
  );
});
