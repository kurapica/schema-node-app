import type { AppType } from "./appType";
import type { AppFieldSchema, Foreign, FieldView, DataCombine } from "../../schema/app/appFieldSchema";
import { type NodeType, type ValueType, type FunctionType, type IProperty, type IPropertyProvider, joinProperties, getNodeType, getPropertiesBySchemaKind, Disable, IValueAccess, Name } from "schema-node-core";
import type { DataCombineType } from "../../enum/dataCombineType";
import { EnableStorage, FieldFilter, Filters, Pageable } from "../../property";
import { SCHEMA_KIND_APP_FIELD } from "../../utils/constant";
import { AppNode } from "../../node/appNode";
import { PageNode } from "../../node/pageNode";

/** The type of the application field. */
export class AppFieldType implements IPropertyProvider {
  private readonly _appFieldSchema: AppFieldSchema;
  private _props?: IProperty[];

  constructor(app: AppType, schema: AppFieldSchema) {
    this.application = app;
    this._appFieldSchema = schema;
  }

  /** Create a data node instance. */
  create(appNode: AppNode, data: unknown): IValueAccess {
    if (this.pageable)
      return new PageNode(this.valueType, data, appNode, this);
    return this.valueType.create(data, appNode, this);
  }

  /** The application that contains this field. */
  readonly application: AppType;

  /** The name of the application. */
  get app(): string { return this.application.name; }

  /** The name of the field. */
  get name(): string { return this._appFieldSchema.name; }

  /** The type of the field. */
  get type(): string { return this._appFieldSchema.type; }

  /** Whether the field is enabled for storage. */
  get enableStorage(): boolean | undefined { return this.getProperty(EnableStorage)?.getValue<boolean>(); }

  /** Whether the field is pageable. */
  get pageable(): boolean | undefined { return this.getProperty(Pageable)?.getValue<boolean>(); }

  /** Whether the field is disabled. */
  get disable(): boolean | undefined { return this.getProperty(Disable)?.getValue<boolean>(); }

  /** The value type of the field. */
  get valueType(): ValueType | undefined { return this._valueType; }
  private _valueType?: ValueType;

  /** The foreign keys of the field. */
  get foreigns(): Foreign[] | undefined { return this._appFieldSchema.foreigns; }

  /** The view of the field. */
  get view(): FieldView | undefined { return this._appFieldSchema.view; }

  /** Whether the view of the field is foreign. */
  get isForeignView(): boolean { return !!this.view?.app; }

  /** The push function of the field. */
  get pushFunc(): FunctionType | undefined { return this._pushFunc; }
  private _pushFunc?: FunctionType;

  /** The push source of the field. */
  get pushSource(): AppFieldType | undefined { return this._pushSource; }
  private _pushSource?: AppFieldType;
  
  /** The combine type of the field. */
  get combine(): DataCombineType | undefined { return this._appFieldSchema.combine; }

  /** The combines of the field. */
  get combines(): DataCombine[] | undefined { return this._appFieldSchema.combines; }

  /** The filters of the field. */
  get filters(): FieldFilter[] | undefined { return this.getProperty(Filters)?.getValue<FieldFilter[]>(); }

  /** The error message of the field. */
  get error(): string | undefined { return this._appFieldSchema.error; }

  /** The observers of the field. */
  private _observers?: AppFieldType[];
  get observers(): readonly AppFieldType[] | undefined { return this._observers; }

  /** Load the field. */
  async load(): Promise<void> {
    this._valueType = await getNodeType(this.type) as ValueType;
    this._props = Array.from(getPropertiesBySchemaKind(this._appFieldSchema, SCHEMA_KIND_APP_FIELD));
    
    // name property
    const name = new Name();
    name.setValue(this._appFieldSchema.name);
    this._props.unshift(name);
    // push
    if (this._appFieldSchema?.source) {
      this._pushSource = this.application.getField(this._appFieldSchema.source);
      this._pushFunc = await getNodeType(this._appFieldSchema.push) as FunctionType;
    }
  }

  /** The reference types of the field. */
  *getRefTypes(): Generator<NodeType> {
    if (this._valueType) yield this._valueType;
    if (this._pushFunc) yield this._pushFunc;
  }

  /** The property of the field. */
  getProperty<T extends IProperty>(propCtor: new () => T): T | undefined {
    return this._props?.find(p => p instanceof propCtor) as T ?? this._valueType?.getProperty(propCtor);
  }

  /** The properties of the field. */
  *getProperties<T extends IProperty>(propCtor: new () => T): Generator<T> {
    return joinProperties(this._props?.filter(p => p instanceof propCtor) as T[], this._valueType?.getProperties(propCtor));
  }

  /** The filtered properties of the field. */
  *filterProperties(predicate: (prop: IProperty) => boolean): Generator<IProperty> {
    return joinProperties(this._props?.filter(predicate), this._valueType?.filterProperties(predicate));
  }

  /** Add an observer to the field. */
  addObserver(observer: AppFieldType): void {
    if (!this._observers) this._observers = [];
    if (!this._observers.includes(observer)) {
      this._observers.push(observer);
    }
  }
}