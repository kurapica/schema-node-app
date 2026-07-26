import type { AppSchema } from "../schema/app/appSchema";
import { AppType } from "./app/appType";
import type { AppFieldSchema } from "../schema/app/appFieldSchema";
import type { AppWorkflowSchema } from "../schema/app/appWorkflowSchema";
import { SchemaLoadState } from "schema-node-core";
import { AppFieldType } from "./app/appFieldType";
import { AppWorkflowType } from "./app/appWorkflowType";

const _rootAppSchema: AppSchema = { name: "" };
const _schemaIndex = new Map<string, AppSchema>();

const _apps = new Map<string, AppType>();

export async function getAppType(fullName: string): Promise<AppType | undefined> {
  fullName = fullName.toLowerCase().trim();

  const cached = _apps.get(fullName);
  if (cached) return cached;

  const parts = fullName.split(".");
  let node: AppType | undefined = rootAppType;
  let currentPath = "";

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

async function loadAppSchema(
  _parent: AppType,
  _name: string,
  fullPath: string
): Promise<AppSchema | undefined> {
  const schema = getSystemAppSchema(fullPath);
  if (schema) return { ...schema, apps: schema.apps ? [...schema.apps] : undefined };

  return undefined;
}

async function createAppType(schema: AppSchema): Promise<AppType> {
  const appType = new AppType();

  appType._schema = schema;

  if (schema.fields?.length) {
    appType._fields = schema.fields.map(f => new AppFieldType(appType, f));
  }

  if (schema.workflows?.length) {
    appType._workflows = schema.workflows.map(w => new AppWorkflowType(appType, w));
  }

  if (schema.apps?.length) {
    appType._schemas = new Map(schema.apps.map(a => [a.name.toLowerCase(), a]));
  }

  return appType;
}