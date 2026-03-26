/**
 * @deprecated This file has been renamed to extractBusiness.ts.
 * The extract_knowledge tool is now extract_business, hitting /v1/business.
 * This file re-exports from extractBusiness for backwards compatibility.
 */
export {
  ExtractBusinessSchema as ExtractKnowledgeSchema,
  extractBusiness as extractKnowledge,
} from "./extractBusiness";
export type { ExtractBusinessArgs as ExtractKnowledgeArgs } from "./extractBusiness";
