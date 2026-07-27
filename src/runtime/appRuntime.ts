import { deepClone } from "schema-node-core";
import type { AppSchema } from "../schema/app/appSchema";
import { AppType } from "./app/appType";
import { getAppSchemaProvider } from "../schema/provider/appSchemaProvider";

let rootAppType: AppType | undefined;

export async function getAppType(fullName: string): Promise<AppType | undefined> {
  fullName = fullName.toLowerCase().trim();
  const parts = fullName.split(".");
  let currentPath = "";

  if (!rootAppType) rootAppType = new AppType();
  let node: AppType | undefined = rootAppType;

  // Try loading cached app types first

  return node;
}

async function loadAppType(root: AppType, segment?: string, reload = false, isLast = false, onlyCache = false): Promise<AppType | undefined> {
  let result: AppType | undefined = root;
  if (segment)
    result = result.getAppType(segment);
  if (result == null && reload || result?.loaded == true && !(isLast && reload))
    return result;

  const schema = await loadAppSchema(root, segment, reload);
  if (!schema) return undefined;

  result ??= new AppType(result != root ? root : undefined);
  const subApps = schema.apps;
  delete schema.apps;

  if (root != result)
  {
    result.saveAppSchema(schema);
    root.saveAppType(segment, result);
  }
  result.loaded = true;
  await result.load(schema);

  if (subApps)
    result.saveAppSchema(subApps);

  return result;
}

async function loadAppSchema(root: AppType | undefined, segment: string, reload?: boolean): Promise<AppSchema | undefined> {
  let schema = reload ? null : root?.getAppSchema(segment);
  if (schema) return deepClone(schema);

  const provider = getAppSchemaProvider();
  const schemaName = root?.name ? `${root?.name}.${segment}` : segment;
  if (provider)
  {
    try
    {
      schema = await provider.getAppSchema(schemaName);
    }
    catch (error)
    {
      console.error(`Failed to load schema from provider: ${segment}`, error);
    }
  }
  return schema;
}
