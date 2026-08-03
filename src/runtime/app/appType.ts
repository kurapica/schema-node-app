import type { AppSchema } from "../../schema/app/appSchema";
import { AppFieldType } from "./appFieldType";
import { AppWorkflowType } from "./appWorkflowType";
import { type NodeType, type ValueType, type IProperty, deepClone, IValueTypeAccess, getPropertiesBySchemaKind, RelationType, getProperty, Relations, RelationSchema, IRelationProvider, SchemaLoadState, Entry, setPropertyValue, Display, _LS } from "schema-node-core";
import { AppScopeType } from "../../enum/appScopeType";
import { AppScopePolicy, ScopePolicy } from "../../property";
import { SCHEMA_KIND_APP } from "../../utils/constant";

/** The application type */
export class AppType implements IValueTypeAccess, IRelationProvider {
  private _schema?: AppSchema;
  private _subApps?: Map<string, AppType>;
  private _schemas?: Map<string, AppSchema>;
  private _fields?: AppFieldType[];
  private _workflows?: AppWorkflowType[];
  private _props?: IProperty[];
  private _relations?: RelationType[];
  loaded = false;

  constructor(parent?: AppType) {
    this.container = parent;
  }

  /** Load the application schema */
  async load(schema: AppSchema) {
    this._schema = schema;
    this._props = Array.from(getPropertiesBySchemaKind(schema, SCHEMA_KIND_APP));

    // load fields
    if (schema.fields) {
      this._fields = schema.fields.map(f => new AppFieldType(this, f));
      for (let field of this._fields) {
        await field.load();
      }
    }

    // load workflows
    if (schema.workflows) {
      this._workflows = schema.workflows.map(w => new AppWorkflowType(this, w));
      for (let workflow of this._workflows) {
        await workflow.load();
      }
    }

    // Load relations from Relations property
    const relations = getProperty(schema, Relations)?.getValue<RelationSchema[]>();
    if (relations?.length)
    {
      const rtypes: RelationType[] = [];
      for (const r of relations)
      {
        const rtype = new RelationType(r, this);
        rtypes.push(rtype);
        await rtype.load();
      }
      this._relations = rtypes;
    }
  }

  /** The application container */
  readonly container?: AppType | undefined;

  /** The application name */
  get name(): string {
    if (!this._schema) return "";
    return this._schema.container ? `${this._schema.container}.${this._schema.name}` : this._schema.name;
  }

  /** The application scope type */
  get scopeType(): AppScopeType { return this.getProperty(ScopePolicy)?.getValue<AppScopePolicy>()?.type ?? AppScopeType.BusinessTarget; }

  /** The application error message */
  get error(): string | undefined { return this._schema?.error; }

  /** Whether this application type is referenced by any other type. */
  get isUsed(): boolean { return (this._fields?.length ?? 0) > 0 || (this._schemas?.size ?? 0) > 0; }

  /** Get all sub-application types */
  *getSubApps(): Generator<AppType> {
    if (!this._subApps) return;
    yield* this._subApps.values();
  }

  /** Get a sub-application type by name */
  getAppType(name: string): AppType | undefined {
    return this._subApps?.get(name.toLowerCase());
  }

  /** Save a sub-application type */
  saveAppType(name: string, app: AppType): void {
    this._subApps ??= new Map();
    this._subApps.set(name.toLowerCase(), app);
  }

  /** Get an application schema by name */
  getAppSchema(name: string): AppSchema | undefined {
    return this._schemas?.get(name.toLowerCase());
  }

  /** Save an application schema */
  saveAppSchema(schema: AppSchema | AppSchema[], reload= false): void {
    if (Array.isArray(schema)) {
      schema.forEach(s => this.saveAppSchema(s, reload));
      return;
    }

    // Ignore the schema name case sensitivity
    if (this.name.toLowerCase() !== schema.container.toLowerCase()) return;

    const name = schema.name.toLowerCase();
    const subApps = schema.apps;
    delete schema.apps;
    
    // save the schema to the map
    this._schemas ??= new Map();
    if (!(this._schemas.has(name) && !reload)){
      this._schemas.set(name, schema);

      // mark the app type need reload
      const type = this._subApps.get(name);
      if (type) type.loaded = false;
    }

    // Create sub app types to save the schemas
    if (subApps?.length)
    {
      let type = this._subApps.get(name);
      if (!type) {
        type = new AppType(this);
        type.load(schema).then(() => type!.loaded = false);
      }
      (type as AppType).saveAppSchema(subApps, reload);
    }
  }

  /** Get all application fields */
  *getFields(): Generator<AppFieldType> {
    if (!this._fields) return;
    yield* this._fields;
  }

  /** Get an application field by name */
  getField(name: string): AppFieldType | undefined {
    return this._fields?.find(f => f.name.toLowerCase() === name.toLowerCase());
  }

  /** Get all application workflows */
  *getWorkflows(): Generator<AppWorkflowType> {
    if (!this._workflows) return;
    yield* this._workflows;
  }

  /** Get an application workflow by name */
  getWorkflow(name: string): AppWorkflowType | undefined {
    return this._workflows?.find(w => w.name.toLowerCase() === name.toLowerCase());
  }

  /** Get a property from the AppSchema. */
  getProperty<T extends IProperty>(propCtor: new () => T): T | undefined {
    return this._props?.find(p => p instanceof propCtor) as T;
  }

  /** Get stacked property values. */
  *getProperties<T extends IProperty>(propCtor: new () => T): Generator<T> {
    if (this._props) {
      for (const prop of this._props) {
        if (prop instanceof propCtor) {
          yield prop;
          if (!prop.stackable) return;
        }
      }
    }
  }

  /** Get all referenced types */
  *getRefTypes(): Generator<NodeType> {
    if (this._fields) {
      for (const field of this._fields) {
        yield* field.getRefTypes();
      }
    }

    if (this._workflows) {
      for (const workflow of this._workflows) {
        yield* workflow.getRefTypes();
      }
    }
  }

  /** Get the application schema */
  getSchema(): AppSchema {
    if (!this._schema) return { name: "" };
    return deepClone(this._schema);
  }

  /** Get all relations */
  *getRelations(): Generator<RelationType> {
    if (!this._relations) return;
    yield* this._relations;
  }

  /** Get the value type of a property */
  getAccessValueType(path: string): ValueType | undefined {
    if (!this._fields?.length) return undefined;

    const dotIndex = path.indexOf(".");
    let remain: string | undefined;
    if (dotIndex > 0) {
      remain = path.substring(dotIndex + 1);
      path = path.substring(0, dotIndex);
    }

    for (const field of this._fields) {
      if (field.name.toLowerCase() === path.toLowerCase()) {
        return remain ? field.valueType?.getAccessValueType(remain) : field.valueType;
      }
    }

    return undefined;
  }

  getAccessEntries(): Entry<string>[] {
    return this._fields
      .filter(f => f.type != null)
      .map(f => {
        const entry = { value: f.name, hasChildren: f.valueType?.hasAccessEntries } as Entry<string>;
        return setPropertyValue(entry, Display, f.getPropertyValue(Display) ?? _LS(f.name));
      });
  }

  get hasAccessEntries(): boolean { return !!this._fields.length; }
}