import { z } from "zod";
import { callApi } from "../lib/config";

const ViewportPresetSchema = z.enum(["mobile", "tablet", "desktop", "desktop_hd"]);
const ViewportObjectSchema = z.object({
  width: z.number().int().min(320).max(3840),
  height: z.number().int().min(320).max(2160),
});

export const TakeScreenshotSchema = z.object({
  url: z.string().url().describe("The URL of the webpage to screenshot"),
  viewport: z
    .union([ViewportPresetSchema, ViewportObjectSchema])
    .optional()
    .describe(
      'Viewport: a preset string ("mobile" 390x844, "tablet" 820x1180, "desktop" 1280x800, "desktop_hd" 1920x1080) or a custom { width, height }. Default: "desktop".'
    ),
  fullPage: z
    .boolean()
    .optional()
    .describe(
      "Capture the entire scrollable height. Use for landing pages or full-article snapshots. Default: false."
    ),
  selector: z
    .string()
    .optional()
    .describe(
      "CSS selector to capture only that element (cropped to its bounding box). Useful for hero sections, pricing cards, charts."
    ),
  waitUntil: z
    .enum(["load", "dom_content_loaded", "network_idle"])
    .optional()
    .describe(
      'When the page is "ready" before capture. Use "network_idle" for SPAs (React/Next/Vue). Default: "load".'
    ),
  waitFor: z
    .string()
    .optional()
    .describe(
      "CSS selector to wait for before capture. Combine with waitUntil for content that hydrates asynchronously."
    ),
});

export type TakeScreenshotArgs = z.infer<typeof TakeScreenshotSchema>;

interface ScreenshotApiResponse {
  runId: string;
  url: string;
  screenshotUrl: string;
  mimeType: string;
  bytes: number;
  durationMs: number;
}

export async function takeScreenshot(
  args: TakeScreenshotArgs,
  _extra: unknown
) {
  try {
    const body: Record<string, unknown> = { url: args.url };
    if (args.viewport !== undefined) body.viewport = args.viewport;
    if (args.fullPage !== undefined) body.fullPage = args.fullPage;
    if (args.selector) body.capture = { selector: args.selector };
    if (args.waitUntil || args.waitFor) {
      body.wait = {
        ...(args.waitUntil ? { until: args.waitUntil } : {}),
        ...(args.waitFor ? { selector: args.waitFor } : {}),
      };
    }

    const result = (await callApi("/v1/screenshot", body)) as ScreenshotApiResponse;

    const imgRes = await fetch(result.screenshotUrl);
    if (!imgRes.ok) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Screenshot captured at ${result.screenshotUrl} but failed to download for inline preview (${imgRes.status} ${imgRes.statusText}). Open the URL directly.`,
          },
        ],
      };
    }
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const base64 = buffer.toString("base64");

    return {
      content: [
        {
          type: "image" as const,
          data: base64,
          mimeType: result.mimeType || "image/png",
        },
        {
          type: "text" as const,
          text: `Screenshot URL: ${result.screenshotUrl}\nSize: ${result.bytes.toLocaleString()} bytes\nDuration: ${result.durationMs} ms`,
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
