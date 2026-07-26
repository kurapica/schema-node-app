import type { AppSchema } from "../../schema/app/appSchema";
import type { AppFieldType } from "./appFieldType";
import type { AppWorkflowType } from "./appWorkflowType";
import type { NodeType, ValueType, IProperty } from "schema-node-core";
import { AppScopeType } from "../../enum/appScopeType";

export class AppType {
  _schema?: AppSchema;
  _subApps?: Map<string, AppType>;
  _schemas?: Map<string, AppSchema>;
  _fields?: AppFieldType[];
  _workflows?: AppWorkflowType[];
  _props?: IProperty[];
  _refTypes?: NodeType[];

  get name(): string {
    if (!this._schema) return "";
    return this._schema.container ? `${this._schema.container}.${this._schema.name}` : this._schema.name;
  }

  get scopeType(): AppScopeType { return this._scopeType; }
  private _scopeType: AppScopeType = AppScopeType.BusinessTarget;

  get container(): AppType | undefined { return this._container; }
  private _container?: AppType;

  get error(): string | undefined { return this._error; }
  private _error?: string;

  get isUsed(): boolean {
    return (this._fields?.length ?? 0) > 0 || (this._schemas?.size ?? 0) > 0;
  }

  getSubApps(): AppType[] {
    return this._subApps ? [...this._subApps.values()] : [];
  }

  getAppType(name: string): AppType | undefined {
    return this._subApps?.get(name.toLowerCase());
  }

  saveAppType(name: string, app: AppType): void {
    if (!this._subApps) this._subApps = new Map();
    this._subApps.set(name.toLowerCase(), app);
  }

  *getFields(): Generator<AppFieldType> {
    if (!this._fields) return;
    yield* this._fields;
  }

  getField(name: string): AppFieldType | undefined {
    return this._fields?.find(f => f.name.toLowerCase() === name.toLowerCase());
  }

  *getWorkflows(): Generator<AppWorkflowType> {
    if (!this._workflows) return;
    yield* this._workflows;
  }

  getWorkflow(name: string): AppWorkflowType | undefined {
    return this._workflows?.find(w => w.name.toLowerCase() === name.toLowerCase());
  }

  getProperty<T extends IProperty>(propCtor: new () => T): T | undefined {
    return this._props?.find(p => p instanceof propCtor) as T;
  }

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

  getPropertyByName(propertyName: string): IProperty | undefined {
    return this._props?.find(p => p.name.toLowerCase() === propertyName.toLowerCase());
  }

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

    if (this._refTypes) {
      yield* this._refTypes;
    }
  }

  getSchema(): AppSchema {
    if (!this._schema) return { name: "" };
    return {
      name: this._schema.name,
      container: this._schema.container,
      fields: this._fields?.map(f => f.getSchema()),
      workflows: this._workflows?.map(w => w.getSchema()),
      apps: this._schemas ? [...this._schemas.values()] : undefined,
    };
  }

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
}