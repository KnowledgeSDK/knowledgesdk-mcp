import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
// Extract (multi-page AI knowledge extraction) is disabled while we focus on
// the scrape surface. Re-enable to bring back the `extract` tool.
// import {
//   ExtractSchema,
//   extract,
// } from "./extract";
import { ScrapeSchema, scrape } from "./scrape";
import { GetSitemapSchema, getSitemap } from "./getSitemap";
import { TakeScreenshotSchema, takeScreenshot } from "./takeScreenshot";
// Search (vector search across indexed knowledge items) is disabled until
// indexing is re-enabled server-side.
// import { SearchKnowledgeSchema, searchKnowledge } from "./searchKnowledge";

// export * from "./extract"; // disabled: scrape-only for now
export * from "./scrape";
export * from "./getSitemap";
export * from "./takeScreenshot";
// export * from "./searchKnowledge";

/**
 * Set up all tools on the MCP server
 */
export const setupTools = (server: Server) => {
  // Register tools/list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      // extract tool disabled — scrape-only surface for now.
      {
        name: "scrape",
        description:
          "Scrape clean markdown content from any webpage URL. Perfect for reading documentation, articles, or any web content.",
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
          'Take a screenshot of any URL. Supports viewport presets (mobile/tablet/desktop/desktop_hd) or custom dimensions, full-page capture, element-only capture via CSS selector, and SPA-aware waits. Returns the rendered PNG (inline image content) plus a permanent CDN URL.',
        inputSchema: {
          type: "object" as const,
          properties: {
            url: {
              type: "string",
              description: "The URL of the webpage to screenshot",
            },
            viewport: {
              description:
                'Viewport size. Either a preset string ("mobile" 390x844, "tablet" 820x1180, "desktop" 1280x800, "desktop_hd" 1920x1080) or a custom object {"width": number, "height": number}. Default: "desktop".',
              oneOf: [
                {
                  type: "string",
                  enum: ["mobile", "tablet", "desktop", "desktop_hd"],
                },
                {
                  type: "object",
                  properties: {
                    width: { type: "integer", minimum: 320, maximum: 3840 },
                    height: { type: "integer", minimum: 320, maximum: 2160 },
                  },
                  required: ["width", "height"],
                },
              ],
            },
            fullPage: {
              type: "boolean",
              description:
                "Capture the entire scrollable document. Use for landing pages or full-article snapshots. Default: false.",
            },
            selector: {
              type: "string",
              description:
                "CSS selector to capture only that element. Useful for hero sections, pricing cards, charts.",
            },
            waitUntil: {
              type: "string",
              enum: ["load", "dom_content_loaded", "network_idle"],
              description:
                'When the page is "ready" before capture. Use "network_idle" for SPAs. Default: "load".',
            },
            waitFor: {
              type: "string",
              description:
                "CSS selector to wait for before capture. Useful for content that hydrates asynchronously.",
            },
          },
          required: ["url"],
        },
      },
      // search_knowledge tool disabled — vector search is paused.
    ],
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        // extract case disabled — scrape-only surface for now.
        case "scrape": {
          const validatedArgs = ScrapeSchema.parse(args);
          return await scrape(validatedArgs, null);
        }

        case "get_sitemap": {
          const validatedArgs = GetSitemapSchema.parse(args);
          return await getSitemap(validatedArgs, null);
        }

        case "take_screenshot": {
          const validatedArgs = TakeScreenshotSchema.parse(args);
          return await takeScreenshot(validatedArgs, null);
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
