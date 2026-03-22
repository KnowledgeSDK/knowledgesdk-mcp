#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Check if API key is set
if (!process.env.KNOWLEDGESDK_API_KEY) {
  console.error("Error: KNOWLEDGESDK_API_KEY environment variable is not set.");
  console.error("Please set it before running the MCP server:");
  console.error("  export KNOWLEDGESDK_API_KEY=your_api_key_here");
  console.error("");
  console.error("To get an API key:");
  console.error("  1. Log in to https://knowledgesdk.com/dashboard");
  console.error("  2. Navigate to Settings → API Keys");
  console.error("  3. Click 'Create API Key'");
  process.exit(1);
}

// Dynamic imports for ES modules
const loadTools = async () => {
  const { setupTools } = await import("./dist/src/tools/index.js");
  return setupTools;
};

async function main() {
  const setupTools = await loadTools();

  const server = new Server(
    {
      name: "@knowledge/mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Set up all the tools
  setupTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("KnowledgeSDK MCP Server started successfully");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
