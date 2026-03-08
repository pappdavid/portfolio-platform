export interface ParsedFunction {
  name: string;
  signature: string;
  body: string;
  docstring: string | null;
  language: 'python' | 'typescript';
}

const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/,
  /ghp_[A-Za-z0-9_]{36}/,
  /sk-[A-Za-z0-9]{32,}/,
  /password\s*=\s*['"][^'"]+['"]/i,
  /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/
];

function containsSecret(text: string): boolean {
  return SECRET_PATTERNS.some((p) => p.test(text));
}

export function parsePython(source: string): ParsedFunction[] {
  const results: ParsedFunction[] = [];
  const regex =
    /((?:"""[\s\S]*?"""|'''[\s\S]*?''')?\s*\n)?(\s*def\s+(\w+)\s*\([^)]*\)[^:]*:)([\s\S]*?)(?=\ndef\s|\nclass\s|$)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    const docstring = match[1]?.trim() || null;
    const signature = match[2].trim();
    const name = match[3];
    const body = match[4]?.trim() || '';
    const full = `${signature}\n${body}`;

    if (!containsSecret(full) && body.length > 10) {
      results.push({ name, signature, body, docstring, language: 'python' });
    }
  }
  return results;
}

export function parseTypeScript(source: string): ParsedFunction[] {
  const results: ParsedFunction[] = [];
  const regex =
    /(\/\*\*[\s\S]*?\*\/\s*\n)?\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)[^{]*\{([\s\S]*?)(?=\n(?:export\s+)?(?:async\s+)?function\s|\nclass\s|$)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    const docstring = match[1]?.trim() || null;
    const name = match[2];
    const params = match[3];
    const body = match[4]?.trim() || '';
    const signature = `function ${name}(${params})`;
    const full = `${signature} {\n${body}\n}`;

    if (!containsSecret(full) && body.length > 10) {
      results.push({
        name,
        signature,
        body,
        docstring,
        language: 'typescript'
      });
    }
  }
  return results;
}

export interface DatasetRow {
  instruction: string;
  input: string;
  output: string;
}

export function generateDataset(
  functions: ParsedFunction[],
  strategy: 'explain-function' | 'write-docstring' = 'explain-function'
): DatasetRow[] {
  return functions.map((fn) => {
    if (strategy === 'write-docstring') {
      return {
        instruction: `Write a docstring for the following ${fn.language} function.`,
        input: `${fn.signature}\n${fn.body}`,
        output:
          fn.docstring ||
          `This function ${fn.name} performs the operation defined in its body.`
      };
    }
    return {
      instruction: `Explain what the following ${fn.language} function does.`,
      input: `${fn.signature}\n${fn.body}`,
      output: fn.docstring
        ? `${fn.docstring}\n\nThe function ${fn.name} implements the logic described above.`
        : `The function ${fn.name} takes parameters and executes the defined logic in its body.`
    };
  });
}

export function toJsonl(rows: DatasetRow[]): string {
  return rows.map((r) => JSON.stringify(r)).join('\n');
}
