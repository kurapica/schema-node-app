import { isNull } from "schema-node-core";

let schemaApiBaseUrl: string | undefined = document.querySelector('meta[name="schema-api-base-url"]')?.getAttribute("content") || undefined;;

/**
 * Sets the schema api base url
 * @param url The schema api base url
 */
export function setSchemaApiBaseUrl(url: string | undefined): void {
  schemaApiBaseUrl = !isNull(url) ? url : undefined;
}

/**
 * Gets the schema api base url
 * @returns The schema api base url
 */
export function getSchemaApiBaseUrl(): string | undefined {
  return schemaApiBaseUrl;
}
