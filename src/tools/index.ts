import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  ExtractKnowledgeSchema,
  extractKnowledge,
} from "./extractKnowledge";
import { ScrapePageSchema, scrapePage } from "./scrapePage";
import { ClassifyBusinessSchema, classifyBusiness } from "./classifyBusiness";
import { GetSitemapSchema, getSitemap } from "./getSitemap";
import { TakeScreenshotSchema, takeScreenshot } from "./takeScreenshot";
import { SearchKnowledgeSchema, searchKnowledge } from "./searchKnowledge";

export * from "./extractKnowledge";
export * from "./scrapePage";
export * from "./classifyBusiness";
export * from "./getSitemap";
export * from "./takeScreenshot";
export * from "./searchKnowledge";

/**
 * Set up all tools on the MCP server
 */
export const setupTools = (server: Server) => {
  // Register tools/list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "extract_knowledge",
        description:
          "Extract structured knowledge from any website URL. Returns business classification, product features, pricing, and key insights.",
        inputSchema: {
          type: "object" as const,
          properties: {
            url: {
              type: "string",
              description: "The website URL to extract knowledge from",
            },
            maxPages: {
              type: "number",
              description: "Maximum number of pages to crawl (optional)",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "scrape_page",
        description:
          "Scrape any webpage and return clean markdown content. Perfect for reading documentation, articles, or any web content.",
        inputSchema: {
          type: "object" as const,
          properties: {
            url: {
              type: "string",
              description: "The URL of the webpage to scrape",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "classify_business",
        description:
          "Classify a business from its website URL. Returns type, industry, target audience, value proposition, and key insights.",
        inputSchema: {
          type: "object" as const,
          properties: {
            url: {
              type: "string",
              description: "The website URL of the business to classify",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_sitemap",
        description:
          "Discover all pages on a website via its sitemap. Returns a list of URLs for further processing.",
        inputSchema: {
          type: "object" as const,
          properties: {
            url: {
              type: "string",
              description: "The website URL to get the sitemap for",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "take_screenshot",
        description:
          "Take a full-page screenshot of any URL. Returns a base64-encoded PNG image.",
        inputSchema: {
          type: "object" as const,
          properties: {
            url: {
              type: "string",
              description: "The URL of the webpage to screenshot",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "search_knowledge",
        description:
          "Search your extracted knowledge base using natural language. Returns relevant knowledge items ranked by semantic similarity.",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: {
              type: "string",
              description:
                "Natural language query to search the knowledge base",
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return (optional)",
            },
          },
          required: ["query"],
        },
      },
    ],
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "extract_knowledge": {
          const validatedArgs = ExtractKnowledgeSchema.parse(args);
          return await extractKnowledge(validatedArgs, null);
        }

        case "scrape_page": {
          const validatedArgs = ScrapePageSchema.parse(args);
          return await scrapePage(validatedArgs, null);
        }

        case "classify_business": {
          const validatedArgs = ClassifyBusinessSchema.parse(args);
          return await classifyBusiness(validatedArgs, null);
        }

        case "get_sitemap": {
          const validatedArgs = GetSitemapSchema.parse(args);
          return await getSitemap(validatedArgs, null);
        }

        case "take_screenshot": {
          const validatedArgs = TakeScreenshotSchema.parse(args);
          return await takeScreenshot(validatedArgs, null);
        }

        case "search_knowledge": {
          const validatedArgs = SearchKnowledgeSchema.parse(args);
          return await searchKnowledge(validatedArgs, null);
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error.message}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${String(error)}`,
          },
        ],
      };
    }
  });
};
