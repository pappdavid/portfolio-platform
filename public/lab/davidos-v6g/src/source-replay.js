// Public fictional fixture for the lexical walkthrough.
export function replaySource() {
  const question = "What is the API batch limit?";
  const sources = [
    { version: 1, visibility: "public", text: "API batch limit" },
    {
      version: 2,
      visibility: "public",
      text: "The API batch limit is up to 50 records.",
    },
    {
      version: 2,
      visibility: "internal",
      text: "Internal review of the API batch limit.",
    },
  ];
  const permitted = sources.filter(
    (s) => s.visibility === "public" && s.version === 2,
  );
  const terms = question.toLowerCase().match(/\w+/g);
  const relevance = (s) =>
    terms.filter((term) => s.text.toLowerCase().includes(term)).length;
  const source = permitted.sort((a, b) => relevance(b) - relevance(a))[0];
  const excerpt = source.text.slice(source.text.indexOf("up to"), -1);
  const approved = Object.freeze({
    sources: Object.freeze(permitted.map((s) => Object.freeze({ ...s }))),
    configuration: Object.freeze({ audience: "customer", version: 2 }),
  });
  const writes = new Map();
  let revision = 0;
  function write(key, expected) {
    if (writes.has(key)) return writes.get(key);
    if (expected !== revision) return { status: 409 };
    const result = { snapshot: approved, revision: ++revision };
    writes.set(key, result);
    return result;
  }
  const expected = revision;
  const active = write("activate", expected);
  const late = write("edit", expected);
  if (write("activate", expected) !== active || late.status !== 409)
    throw Error("Invalid fixture revision");
  return { sources, source, excerpt, question, active, late };
}
