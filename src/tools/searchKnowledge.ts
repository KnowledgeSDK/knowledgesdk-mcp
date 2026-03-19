import { z } from "zod";
import { callApi } from "../lib/config";

export const SearchKnowledgeSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe("Natural language query to search the knowledge base"),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .describe("Maximum number of results to return (optional)"),
});

export type SearchKnowledgeArgs = z.infer<typeof SearchKnowledgeSchema>;

export async function searchKnowledge(
  args: SearchKnowledgeArgs,
  _extra: unknown
) {
  try {
    const body: Record<string, any> = { query: args.query };
    if (args.limit !== undefined) {
      body.limit = args.limit;
    }

    const result = await callApi("/v1/search", body);

    const items: any[] =
      result.results ||
      result.items ||
      result.hits ||
      (Array.isArray(result) ? result : []);

    const lines: string[] = [
      `Search results for: "${args.query}"`,
      `Results found: ${items.length}`,
      "",
    ];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      lines.push(`## Result ${i + 1}`);
      if (item.score !== undefined) lines.push(`Score: ${item.score}`);
      if (item.title) lines.push(`Title: ${item.title}`);
      if (item.url) lines.push(`URL: ${item.url}`);
      if (item.content) {
        lines.push("");
        lines.push(item.content);
      }
      if (item.snippet) {
        lines.push("");
        lines.push(item.snippet);
      }
      lines.push("");
    }

    if (items.length === 0) {
      lines.push("No results found.");
      if (result && typeof result === "object" && !Array.isArray(result)) {
        lines.push("");
        lines.push("## Raw Result");
        lines.push(JSON.stringify(result, null, 2));
      }
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
