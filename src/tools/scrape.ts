import { z } from "zod";
import { callApi } from "../lib/config";

export const ScrapeSchema = z.object({
  url: z.string().url().describe("The URL of the webpage to scrape"),
});

export type ScrapeArgs = z.infer<typeof ScrapeSchema>;

export async function scrape(args: ScrapeArgs, _extra: unknown) {
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
