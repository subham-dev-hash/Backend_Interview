import { McpServer, StdioServerTransport } from "@modelcontextprotocol/server"
import { z } from 'zod';

// Initialize MCP server
const server = new McpServer({
    name: "my-first-mcp-server",
    version: "1.0.0"
})

// Register a Custom tool
server.registerTool(
    'calculate_hypotenuse',
    'Calculates the hypotenuse of a right-angled triangle given sides a and b',
    {
        a: z.number().positive().describe("Length of side a"),
        b: z.number().positive().describe("Length of side b"),
    },
    async ({ a, b }) => {
        const hypotenuse = Math.sqrt(a * a + b * b);
        return {
            content: [{ type: 'text', text: `The hypotenuse is ${hypotenuse}` }]
        }
    }
)

// Connect using the standard input/output transport layer
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("MCP Server running on stdio");