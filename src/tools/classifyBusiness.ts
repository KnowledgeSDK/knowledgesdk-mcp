import { z } from "zod";
import { callApi } from "../lib/config";

export const ClassifyBusinessSchema = z.object({
  url: z.string().url().describe("The website URL of the business to classify"),
});

export type ClassifyBusinessArgs = z.infer<typeof ClassifyBusinessSchema>;

export async function classifyBusiness(
  args: ClassifyBusinessArgs,
  _extra: unknown
) {
  try {
    const result = await callApi("/v1/classify", { url: args.url });

    const lines: string[] = [
      `Business classified successfully for: ${args.url}`,
      "",
    ];

    if (result.type) lines.push(`- Type: ${result.type}`);
    if (result.sector) lines.push(`- Sector: ${result.sector}`);
    if (result.industry) lines.push(`- Industry: ${result.industry}`);
    if (result.targetAudience) lines.push(`- Target Audience: ${result.targetAudience}`);
    if (result.valueProposition) lines.push(`- Value Proposition: ${result.valueProposition}`);

    if (result.insights && Array.isArray(result.insights) && result.insights.length > 0) {
      lines.push("");
      lines.push("## Key Insights");
      for (const insight of result.insights) {
        lines.push(`- ${insight}`);
      }
    }

    if (
      !result.type &&
      !result.sector &&
      !result.industry &&
      !result.targetAudience &&
      !result.valueProposition
    ) {
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
