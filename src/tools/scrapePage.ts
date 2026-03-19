import { z } from "zod";
import { callApi } from "../lib/config";

export const ScrapePageSchema = z.object({
  url: z.string().url().describe("The URL of the webpage to scrape"),
});

export type ScrapePageArgs = z.infer<typeof ScrapePageSchema>;

export async function scrapePage(args: ScrapePageArgs, _extra: unknown) {
  try {
    const result = await callApi("/v1/scrape", { url: args.url });

    const markdown =
      result.markdown ||
      result.content ||
      result.text ||
      JSON.stringify(result, null, 2);

    return {
      content: [
        {
          type: "text" as const,
          text: markdown,
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
