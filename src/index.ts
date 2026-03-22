import { hasApiKey } from "./lib/config";
import { setupTools } from "./tools";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

export interface McpServerOptions {
  verboseLogs?: boolean;
}

/**
 * Create a KnowledgeSDK MCP server
 * Returns a configured Server instance ready to be connected to a transport
 */
export const createKnowledgeSdkMcpServer = (
  options: McpServerOptions = {}
): Server => {
  if (!hasApiKey()) {
    console.warn(
      "KNOWLEDGESDK_API_KEY is not set. Tools will return errors when called."
    );
  }

  if (options.verboseLogs) {
    console.error("KnowledgeSDK MCP Server: verbose logs enabled");
  }

  const server = new Server(
    {
      name: "@knowledgesdk/mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  setupTools(server);

  return server;
};

// Re-export types for convenience
export * from "./tools/extractKnowledge";
export * from "./tools/scrapePage";
export * from "./tools/classifyBusiness";
export * from "./tools/getSitemap";
export * from "./tools/takeScreenshot";
export * from "./tools/searchKnowledge";
