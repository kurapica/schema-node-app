import type { AppType } from "./appType";
import type { AppFieldSchema } from "../../schema/app/appFieldSchema";
import { type NodeType, type ValueType, type IProperty, type IPropertyProvider, joinProperties, getNodeType, getPropertiesBySchemaKind, Name, ReadOnly, DataNode } from "schema-node-core";
import { EnableStorage, Pageable } from "../../property";
import { SCHEMA_KIND_APP_FIELD } from "../../utils/constant";
import { AppNode } from "../../node/appNode";
import { PageNode } from "../../node/pageNode";
import { DataUpdate } from "../../property/app/dataUpdate";
import { View } from "../../property/app/view";
import { DataDerive } from "../../property/app/dataDerive";

/** The type of the application field. */
export class AppFieldType implements IPropertyProvider {
  private readonly _appFieldSchema: AppFieldSchema;
  private _props?: IProperty[];

  constructor(app: AppType, schema: AppFieldSchema) {
    this.application = app;
    this._appFieldSchema = schema;
  }

  /** Create a data node instance. */
  create(appNode: AppNode, data: unknown): DataNode {
    return this.getPropertyValue(Pageable)
      ? new PageNode(this.valueType, data, appNode, this)
      : this.valueType.create(data, appNode, this);
  }

  /** The application that contains this field. */
  readonly application: AppType;

  /** The name of the application. */
  get app(): string { return this.application.name; }

  /** The name of the field. */
  get name(): string { return this._appFieldSchema.name; }

  /** The type of the field. */
  get type(): string { return this._appFieldSchema.type; }

  /** The value type of the field. */
  get valueType(): ValueType | undefined { return this._valueType; }
  private _valueType?: ValueType;

  get inputable(): boolean { return this._inputable; }
  private _inputable: boolean = false;

  /** The error message of the field. */
  get error(): string | undefined { return this._appFieldSchema.error; }

  /** Load the field. */
  async load(): Promise<void> {
    this._valueType = await getNodeType(this.type) as ValueType;
    this._props = Array.from(getPropertiesBySchemaKind(this._appFieldSchema, SCHEMA_KIND_APP_FIELD));

    // inputable check
    this._inputable = !(this.getProperty(DataDerive)?.hasValue || this.getProperty(View)?.hasValue);
    
    // readonly check
    if (!this.getPropertyValue(ReadOnly) 
        || this.getPropertyValue(DataUpdate) === false // no permission
        || !this.getPropertyValue(EnableStorage)       // no storage
        || this.getProperty(View)?.hasValue            // is view
        || this.getProperty(DataDerive)?.hasValue)     // is derive
    {
      const readonly = new ReadOnly();
      readonly.setValue(true);
      this._props?.unshift(readonly);
    }

    // name property
    const name = new Name();
    name.setValue(this._appFieldSchema.name);
    this._props.unshift(name);
  }

  /** The reference types of the field. */
  *getRefTypes(): Generator<NodeType> {
    if (this._valueType) yield this._valueType;
  }

  /** The property of the field. */
  getProperty<T extends IProperty>(propCtor: new () => T): T | undefined {
    return this._props?.find(p => p instanceof propCtor) as T ?? this._valueType?.getProperty(propCtor);
  }

  /** The property value of the field. */
  getPropertyValue<T>(propCtor: new () => IProperty): T | undefined {
    return this.getProperty(propCtor)?.getValue<T>();
  }

  /** The properties of the field. */
  *getProperties<T extends IProperty>(propCtor: new () => T): Generator<T> {
    return joinProperties(this._props?.filter(p => p instanceof propCtor) as T[], this._valueType?.getProperties(propCtor));
  }

  /** The filtered properties of the field. */
  *filterProperties(predicate: (prop: IProperty) => boolean): Generator<IProperty> {
    return joinProperties(this._props?.filter(predicate), this._valueType?.filterProperties(predicate));
  }
}