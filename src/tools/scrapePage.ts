/**
 * @deprecated This file has been renamed to extractPage.ts.
 * The scrape_page tool is now extract_page, hitting /v1/extract.
 * This file re-exports from extractPage for backwards compatibility.
 */
export {
  ExtractPageSchema as ScrapePageSchema,
  extractPage as scrapePage,
} from "./extractPage";
export type { ExtractPageArgs as ScrapePageArgs } from "./extractPage";
