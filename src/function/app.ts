import { ArgName, ArrayType, combinePaths, Display, Entry, EntryAccess, getPropertyValue, LocaleString, Meta, NamespaceType, NS_SYSTEM_BOOL, NS_SYSTEM_ENTRY_ACCESS, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_LIST, NS_SYSTEM_STRING, OfSchema, Return, SCHEMA_KIND_FUNCTION, SCHEMA_KIND_NAMESPACE, SchemaType, setPropertyValue } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_REFLECT_APP } from "../utils";
import { getAppType } from "../runtime";
import { Foreign, Foreigns } from "../property";

@Meta(SchemaType, NS_SYSTEM_SCHEMA_REFLECT_APP)
@Meta(OfSchema, SCHEMA_KIND_FUNCTION)
export class SystemReflectApp
{
  /// <summary>
  /// Gets the application entries
  /// </summary>
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappentries`)
  @Meta(Return, `${NS_SYSTEM_LIST}<${NS_SYSTEM_ENTRY_ACCESS}<${NS_SYSTEM_STRING}>>`)
  static async getappentries(
    @Meta(ArgName, "name")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    name?: string, root?: string)
  {
    name = name?.toLowerCase() ?? '';
    root = root?.toLowerCase() ?? '';
    if (!name && !root || name !== root && !name.startsWith(`${root}.`))
      return [];

    let ns = await getAppType(name ?? root);
    if (!ns) return [];

    let result: EntryAccess<string>[] = [];
    while (ns != null)
    {
      let access: EntryAccess<string> = {};
      if (ns.container != null)
      {
        access.entry = setPropertyValue(
          { value: ns.name, hasChildren: ns.hasSubApps },
          Display,
          ns.getProperty(Display)?.getValue<LocaleString>()
        );
      }
      if (ns.hasSubApps)
      {
        access.children = Array.from(ns.getSubAppSchemas().map(s => {
          return setPropertyValue(
            { value: combinePaths(ns!.name, s.name), hasChildren: s.hasApps ?? !(s.hasFields || s.fields?.length) },
            Display,
            getPropertyValue(s, Display)
          );
        }));
      }
      result.push(access);
      ns = ns.container;
      if (root && ns?.name === root) break;
    }
    result.reverse();
    return result;
  }

  /// <summary>
  /// Gets the application fields
  /// </summary>
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfields`)
  @Meta(Return, `${NS_SYSTEM_LIST}<${NS_SYSTEM_ENTRY_ACCESS}<${NS_SYSTEM_STRING}>>`)
  static async getappfields(
    @Meta(ArgName, "app")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    app: string)
  {
    let appType = await getAppType(app);
    if (!appType) return [];
    return [{ 
      children: appType.getFields().map(s => {
        const entry: Entry<string> = { value: s.name, hasChildren: false };
        let display = s.getPropertyValue(Display);
        if (display != null) setPropertyValue(entry, Display, display);
        return entry;
      })
    }];
  }

  /// <summary>
  /// Gets the application foreign field entries to the given application
  /// </summary>
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappforeignfields`)
  @Meta(Return, `${NS_SYSTEM_LIST}<${NS_SYSTEM_ENTRY_ACCESS}<${NS_SYSTEM_STRING}>>`)
  static async getappforeignfields(
    @Meta(ArgName, "app")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    app: string,
  
    @Meta(ArgName, "foreignApp")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    foreignApp: string,
  ) {
    let appType = await getAppType(app);
    if (!appType) return [];
    return [{ 
      children: appType.getFields().filter(s => {
        const foreigns = s.getPropertyValue<Foreign[]>(Foreigns);
        return foreigns?.some(f => f.app.toLowerCase() === foreignApp.toLowerCase());
      })
      .map(s => {
        const entry: Entry<string> = { value: s.name, hasChildren: false };
        let display = s.getPropertyValue(Display);
        if (display != null) setPropertyValue(entry, Display, display);
        return entry;
      })
    }];
  }

  /// <summary>
  /// Gets the app field type
  /// </summary>
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfieldtype`)
  @Meta(Return, NS_SYSTEM_STRING)
  static async getappfieldtype(
    @Meta(ArgName, "app")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    app: string,

    @Meta(ArgName, "field")
    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    field: string,

    @Meta(ArgName, "elementType")
    @Meta(SchemaType, NS_SYSTEM_BOOL)
    elementType?: boolean
  ): Promise<string | undefined>
  {
    let appType = await getAppType(app);
    let fieldType = appType?.getField(field);
    if (fieldType == null) return undefined;
    return elementType && fieldType.valueType instanceof ArrayType
      ? fieldType.valueType.element?.name
      : fieldType.valueType?.name;
  }
}