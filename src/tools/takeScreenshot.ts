import { z } from "zod";
import { callApi } from "../lib/config";

export const TakeScreenshotSchema = z.object({
  url: z.string().url().describe("The URL of the webpage to screenshot"),
});

export type TakeScreenshotArgs = z.infer<typeof TakeScreenshotSchema>;

export async function takeScreenshot(
  args: TakeScreenshotArgs,
  _extra: unknown
) {
  try {
    const result = await callApi("/v1/screenshot", { url: args.url });

    const base64Image =
      result.image ||
      result.screenshot ||
      result.data ||
      result.base64;

    if (!base64Image) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Screenshot taken for: ${args.url}\n\nRaw Result:\n${JSON.stringify(result, null, 2)}`,
          },
        ],
      };
    }

    // Strip data URI prefix if present (e.g. "data:image/png;base64,...")
    const cleanBase64 = base64Image.includes(",")
      ? base64Image.split(",")[1]
      : base64Image;

    return {
      content: [
        {
          type: "image" as const,
          data: cleanBase64,
          mimeType: "image/png",
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
