import { ArrayType, Display, EnumType, generateGuid, getNodeType, isNull, NodeType, ScalarType, StructType } from "schema-node-core";

import type { LocaleString } from "schema-node-core";

import { NS_SYSTEM_GUID, SCHEMA_KIND_BOOL, SCHEMA_KIND_DATE, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_INT, SCHEMA_KIND_STRING } from "schema-node-core";

/** Mocks the schema data */
export async function mockSchemaData(name: string | NodeType): Promise<any> {
  if (isNull(name)) return null;
  const schema = typeof name === "string" ? await getNodeType(name) : name;
  if (!schema) return null;

  if (schema instanceof ScalarType)
  {
    switch (schema.kind)
    {
      case SCHEMA_KIND_INT:
        return 0;
      case SCHEMA_KIND_DECIMAL:
        return 0.0;
      case SCHEMA_KIND_STRING:
        return schema.name == NS_SYSTEM_GUID ? generateGuid() : "";
      case SCHEMA_KIND_DATE:
        return new Date();
      case SCHEMA_KIND_BOOL:
        return false;
    }
  }
  else if (schema instanceof EnumType)
  {
    return (await schema.getEnumEntryAccess())[0]?.children?.[0]?.value;
   }
  else if (schema instanceof StructType)
  {
      const obj: any = {};
      schema.getFields().forEach((f) => {
        const data = mockSchemaData(f.type!);
        obj[f.name] = isNull(data)
          ? (f.getProperty(Display)?.getValue<LocaleString>()?.key || f.name)
          : data;
      });
      return obj;
  }
  else if (schema instanceof ArrayType)
  {
    return [mockSchemaData(schema.element)].filter(f => !isNull(f));
  }
  return null;
}
