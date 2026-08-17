import { joinProperties, getNodeType, getPropertiesBySchemaKind, Name, ReadOnly, deepClone } from "schema-node-core";
import { Pageable, DataUpdate, View, DataDerive, Inputable } from "./property";
import { PageNode } from "../../node/pageNode";

import type { AppFieldSchema } from "./type";
import type { NodeType, ValueType, IProperty, IPropertyProvider, PropertyCtor, IValueAccess } from "schema-node-core";
import type { IAppFieldType, IAppNode, IAppType } from "../app/type";

import { SCHEMA_KIND_APP_FIELD } from "../../utils/constant";

/** The type of the application field. */
export class AppFieldType implements IPropertyProvider, IAppFieldType {
  private readonly _appFieldSchema: AppFieldSchema;
  private _props?: IProperty[];

  constructor(app: IAppType, schema: AppFieldSchema) {
    this.application = app;
    this._appFieldSchema = schema;
  }

  /** Create a data node instance. */
  create(appNode: IAppNode, data: unknown): IValueAccess {
    return this.getPropertyValue(Pageable)
      ? new PageNode(this.valueType, data, appNode, this)
      : this.valueType.create(data, appNode, this);
  }

  /** The application that contains this field. */
  readonly application: IAppType;

  /** The name of the application. */
  get app(): string { return this.application.name; }

  /** The name of the field. */
  get name(): string { return this._appFieldSchema.name; }

  /** The type of the field. */
  get type(): string { return this._appFieldSchema.type; }

  /** The value type of the field. */
  get valueType(): ValueType | undefined { return this._valueType; }
  private _valueType?: ValueType;

  /** The error message of the field. */
  get error(): string | undefined { return this._appFieldSchema.error; }

  /** The schema of the field. */
  getFieldSchema(): AppFieldSchema { return deepClone(this._appFieldSchema); }

  /** Load the field. */
  async load(): Promise<void> {
    this._valueType = await getNodeType(this.type) as ValueType;
    this._props = Array.from(getPropertiesBySchemaKind(this._appFieldSchema, SCHEMA_KIND_APP_FIELD));

    // inputable check
    if (!(this.getProperty(DataDerive)?.hasValue || this.getProperty(View)?.hasValue)) {
      const inputable = new Inputable();
      inputable.setValue(true);
      this._props?.unshift(inputable);
    }
    
    // force readonly
    if (!this.getPropertyValue(ReadOnly) 
        || this.getPropertyValue(DataUpdate) === false
        || this.getProperty(View)?.hasValue
        || this.getProperty(DataDerive)?.hasValue)
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
  getProperty<T extends IProperty>(propCtor: string | PropertyCtor): T | undefined {
    return this._props?.find(p => typeof propCtor === "string" ? p.name.toLowerCase() === propCtor.toLowerCase() : p instanceof propCtor) as T ?? this._valueType?.getProperty(propCtor);
  }
  

  /** The property value of the field. */
  getPropertyValue<T>(propCtor: string | PropertyCtor): T | undefined {
    return this.getProperty(propCtor)?.getValue<T>();
  }

  /** The properties of the field. */
  *getProperties<T extends IProperty>(propCtor: string | PropertyCtor): Generator<T> {
    for (let prop of joinProperties(this._props?.filter(p => typeof propCtor === "string" ? p.name.toLowerCase() === propCtor.toLowerCase() : p instanceof propCtor) as T[], this._valueType?.getProperties(propCtor))) 
      yield prop as T;
  }
  
  /** Gets the property values */
  *getPropertyValues<T>(propCtor: PropertyCtor | string): Generator<T> { for (let prop of this.getProperties(propCtor)) yield prop.getValue() as T; }


  /** The filtered properties of the field. */
  *filterProperties(predicate: (prop: IProperty) => boolean): Generator<IProperty> {
    for (let prop of joinProperties(this._props?.filter(predicate), this._valueType?.filterProperties(predicate))) yield prop;
  }
}
