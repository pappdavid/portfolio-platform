// A local, fictional fixture for the source press. No hosted API is contacted.
export function replaySource() {
  const question = "What is the API batch limit?";
  const sources = [
    {
      version: 2,
      audience: "customer",
      text: "The API batch limit is up to 50 records.",
    },
    {
      version: 2,
      audience: "internal",
      text: "The internal review notes apply to the API batch limit.",
    },
  ];
  const tokens = (text) =>
    new Set(
      text
        .toLowerCase()
        .match(/[a-z]+/g)
        .filter((w) => w.length > 2),
    );
  const query = tokens(question);
  const ranked = sources
    .map((source) => ({
      source,
      score: [...tokens(source.text)].filter((w) => query.has(w)).length,
    }))
    .sort((a, b) => b.score - a.score);
  const visible = ranked.filter((hit) => hit.source.audience === "customer");
  const source = visible[0].source;
  const excerpt = source.text.slice(source.text.indexOf("up to"), -1);
  const approved = Object.freeze({
    configuration: Object.freeze({ audience: "customer" }),
    sources: Object.freeze(
      visible.map(({ source }) => Object.freeze({ ...source })),
    ),
  });
  const writes = new Map();
  let revision = source.version;
  function write(key, expected, snapshot) {
    if (writes.has(key)) return writes.get(key);
    if (expected !== revision) return { status: 409 };
    revision++;
    const result = { snapshot, revision };
    writes.set(key, result);
    return result;
  }
  const active = write("activate-review", source.version, approved);
  const late = write("late-edit", source.version, approved);
  if (
    active !== write("activate-review", source.version, approved) ||
    late.status !== 409
  )
    throw Error("Invalid fixture revision");
  return {
    question,
    excerpt,
    source,
    held: ranked.length - visible.length,
    active,
    late,
  };
}
