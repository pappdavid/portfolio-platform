import { generatePageMetadata } from '@/lib/metadata';
import { McpContent } from '@/components/mcp/mcp-content';

export const metadata = generatePageMetadata({
  title: 'MCP Sentinel',
  description:
    'Drop-in observability for agent tool calls. Log, guard, and audit every MCP interaction.',
  slug: 'mcp-sentinel'
});

export default function McpPage() {
  return <McpContent />;
}
