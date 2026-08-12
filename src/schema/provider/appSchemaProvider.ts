import { useSchemaProvider } from "schema-node-core";
import { type IAppSchemaProvider } from "./interface";

let schemaProvider: IAppSchemaProvider | null = null;

/**
 * Sets the data schema provider
 */
export function useAppSchemaProvider(
  provider: IAppSchemaProvider
): void {
  schemaProvider = provider;
  useSchemaProvider(provider);
}

/**
 * Gets the data schema provider
 */
export function getAppSchemaProvider(): IAppSchemaProvider | undefined {
  return schemaProvider;
}

//#endregion
