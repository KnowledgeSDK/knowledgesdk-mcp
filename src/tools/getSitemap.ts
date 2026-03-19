import { z } from "zod";
import { callApi } from "../lib/config";

export const GetSitemapSchema = z.object({
  url: z.string().url().describe("The website URL to get the sitemap for"),
});

export type GetSitemapArgs = z.infer<typeof GetSitemapSchema>;

export async function getSitemap(args: GetSitemapArgs, _extra: unknown) {
  try {
    const result = await callApi("/v1/sitemap", { url: args.url });

    const urls: string[] =
      result.urls ||
      result.pages ||
      (Array.isArray(result) ? result : []);

    const lines: string[] = [
      `Sitemap discovered for: ${args.url}`,
      `Total URLs found: ${urls.length}`,
      "",
      "## URLs",
    ];

    for (const pageUrl of urls) {
      lines.push(`- ${pageUrl}`);
    }

    if (urls.length === 0) {
      lines.push("(no URLs found)");
      lines.push("");
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
