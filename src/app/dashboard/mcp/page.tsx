import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { McpDashboardContent } from '@/features/mcp-dashboard/components/mcp-dashboard-content';

export const metadata = {
  title: 'MCP Dashboard'
};

export default function MCPDashboardPage() {
  return (
    <PageContainer>
      <Heading
        title='MCP Sentinel'
        description='Manage API keys and view event logs.'
      />
      <McpDashboardContent />
    </PageContainer>
  );
}
