import { supabaseAdmin } from '@/lib/supabase/admin';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (
    input: Record<string, unknown>,
    userId: string
  ) => Promise<Record<string, unknown>>;
}

export const mcpTools: ToolDefinition[] = [
  {
    name: 'sentinel.log_event',
    description: 'Log a tool call with metadata',
    inputSchema: {
      type: 'object',
      properties: {
        tool_name: { type: 'string', description: 'Name of the tool called' },
        action: {
          type: 'string',
          description: 'Action taken (allow, deny, warn, log)'
        },
        metadata: {
          type: 'object',
          description: 'Optional metadata about the call'
        }
      },
      required: ['tool_name', 'action']
    },
    handler: async (input, userId) => {
      const { error } = await supabaseAdmin.from('mcp_events').insert({
        user_id: userId,
        tool_name: input.tool_name as string,
        action: input.action as string,
        meta_json: (input.metadata as Record<string, unknown>) || {}
      });
      if (error) throw new Error(error.message);
      return {
        event_id: crypto.randomUUID(),
        logged_at: new Date().toISOString()
      };
    }
  },
  {
    name: 'sentinel.guard',
    description: 'Check if a tool call should be allowed',
    inputSchema: {
      type: 'object',
      properties: {
        tool_name: { type: 'string', description: 'Tool name to evaluate' },
        payload_summary: {
          type: 'string',
          description: 'Summary of the payload'
        }
      },
      required: ['tool_name', 'payload_summary']
    },
    handler: async (input, userId) => {
      const blocked = ['rm_rf', 'exec_shell', 'send_email_bulk', 'drop_table'];
      const toolName = input.tool_name as string;
      const decision = blocked.includes(toolName) ? 'deny' : 'allow';

      await supabaseAdmin.from('mcp_events').insert({
        user_id: userId,
        tool_name: toolName,
        action: decision,
        meta_json: { payload_summary: input.payload_summary }
      });

      return {
        decision,
        reason:
          decision === 'deny'
            ? 'Tool is blocked by policy'
            : 'Allowed by policy'
      };
    }
  },
  {
    name: 'sentinel.cost_estimate',
    description: 'Estimate token cost from payload length',
    inputSchema: {
      type: 'object',
      properties: {
        payload_length: {
          type: 'number',
          description: 'Character count of the payload'
        },
        model: {
          type: 'string',
          description: 'Model name for pricing lookup',
          default: 'gpt-4o'
        }
      },
      required: ['payload_length']
    },
    handler: async (input) => {
      const tokens = Math.ceil((input.payload_length as number) / 4);
      const model = (input.model as string) || 'gpt-4o';
      const costPer1k = model.includes('4o') ? 0.005 : 0.002;
      return {
        estimated_tokens: tokens,
        estimated_cost_usd: Number(((tokens / 1000) * costPer1k).toFixed(6)),
        model
      };
    }
  }
];
