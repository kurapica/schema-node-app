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

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!node) return undefined;
    currentPath = currentPath ? `${currentPath}.${part}` : part;

    const schema = await loadAppSchema(node, part, currentPath);
    if (!schema) return undefined;

    const existing = node.getAppType(part);
    if (existing) {
      node = existing;
      continue;
    }

    const appType = await createAppType(schema);
    node.saveAppType(part, appType);
    _apps.set(currentPath, appType);

    node = appType;
  }

  return node;
}

async function loadAppType(root: AppType, segment?: string, reload = false, isLast = false, onlyCache = false): Promise<AppType | undefined> {
  let result: AppType | undefined = root;
  if (segment)
  {
    result = result.getAppType(segment);
  }
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
