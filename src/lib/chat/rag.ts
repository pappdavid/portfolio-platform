export function chunkText(text: string, chunkSize = 500): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = '';
    }
    current += para + '\n\n';
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks;
}

export function retrieveChunks(
  query: string,
  chunks: string[],
  topK = 5
): string[] {
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  return chunks
    .map((chunk) => ({
      chunk,
      score: queryWords.filter((w) => chunk.toLowerCase().includes(w)).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((c) => c.score > 0)
    .map((c) => c.chunk);
}
