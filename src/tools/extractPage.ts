import { z } from "zod";
import { callApi } from "../lib/config";

export const ExtractPageSchema = z.object({
  url: z.string().url().describe("The URL of the webpage to extract content from"),
});

export type ExtractPageArgs = z.infer<typeof ExtractPageSchema>;

export async function extractPage(args: ExtractPageArgs, _extra: unknown) {
  try {
    const result = await callApi("/v1/extract", { url: args.url });

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
