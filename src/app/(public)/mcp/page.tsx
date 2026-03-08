import { Metadata } from 'next';
import { McpContent } from '@/components/mcp/mcp-content';

export const metadata: Metadata = {
  title: 'MCP Sentinel — Agent Observability',
  description:
    'Drop-in observability for agent tool calls. Log, guard, and audit every MCP interaction.'
};

export default function McpPage() {
  return <McpContent />;
}
