import { z } from "zod";
import { callApi } from "../lib/config";

export const ExtractBusinessSchema = z.object({
  url: z.string().url().describe("The website URL to extract business knowledge from"),
  maxPages: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Maximum number of pages to crawl (optional)"),
});

export type ExtractBusinessArgs = z.infer<typeof ExtractBusinessSchema>;

export async function extractBusiness(
  args: ExtractBusinessArgs,
  _extra: unknown
) {
  try {
    const body: Record<string, any> = { url: args.url };
    if (args.maxPages !== undefined) {
      body.maxPages = args.maxPages;
    }

    const result = await callApi("/v1/business", body);

    const lines: string[] = [
      `Business knowledge extracted successfully from: ${args.url}`,
      "",
    ];

    if (result.businessInfo) {
      lines.push("## Business Info");
      lines.push(JSON.stringify(result.businessInfo, null, 2));
      lines.push("");
    }

    if (result.knowledgeItems && Array.isArray(result.knowledgeItems)) {
      lines.push(`## Knowledge Items (${result.knowledgeItems.length} found)`);
      for (const item of result.knowledgeItems) {
        lines.push("");
        lines.push(`### ${item.title || item.type || "Item"}`);
        if (item.content) lines.push(item.content);
        if (item.url) lines.push(`Source: ${item.url}`);
      }
    } else {
      lines.push("## Raw Result");
      lines.push(JSON.stringify(result, null, 2));
    }

    return {
      content: [
        {
          type: "text" as const,
          text: lines.join("\n"),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`,
        },
      ],
    };
  }
}
