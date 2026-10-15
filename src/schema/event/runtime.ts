import { NodeType, ValueType, getPropertiesBySchemaKind, getNodeType, getProperty, Relations, SCHEMA_KIND_NODE_FUNC_ARG, RelationType, _LS, Display, FUNC_RETURN, setPropertyValue, splitString, NS_SYSTEM_OBJECT, getPropertyValue } from "schema-node-core";

import { type IProperty, type INodeType, type IRelation, type RelationSchema, type Entry, type IPropertyProvider, type IRelationProvider, type IValueAccess, type IValueTypeAccess, FunArgsType } from "schema-node-core";
import type { EventSchema } from "./type";

import { SCHEMA_KIND_NODE_EVENT } from "../../utils/constant";

export class EventType extends NodeType implements IValueTypeAccess, IRelationProvider{
  private _eventSchema?: EventSchema;
  private _payload?: ValueType;
  private _relations: IRelation[] | undefined;
  private _args?: FunArgsType;
  private _objectType: IValueTypeAccess | undefined;

  get payload(): ValueType | undefined { return this._payload; }

  /** Argument definitions. */
  get args(): FunArgsType { return this._args! }  

  get isUsed(): boolean { return true; }

  override loadProperties(): IProperty[] {
    this._eventSchema = getPropertyValue<EventSchema>(this.getNodeSchema(), "event");
    return this._eventSchema ? Array.from(getPropertiesBySchemaKind(this._eventSchema, SCHEMA_KIND_NODE_EVENT)) : [];
  }

  override async load(threadId?: string) {
    if (this._eventSchema?.payload)
      this._payload = await getNodeType(this._eventSchema.payload, this.generics, this.genericParams, undefined, threadId) as ValueType;
      
    this._args = new FunArgsType(this._eventSchema.args ?? []);
    await this._args.load(this.generics, this.genericParams, threadId);
    this._objectType = await getNodeType(NS_SYSTEM_OBJECT, undefined, undefined, undefined, threadId) as unknown as IValueTypeAccess;

    // Load relations from Relations property
    if (!this.isGeneric) {
      const relations = getProperty(this._eventSchema, Relations)?.getValue<RelationSchema[]>();
      if (relations?.length)
      {
        const rtypes: IRelation[] = [];
        for (const r of relations)
        {
          const rtype = new RelationType(r, this);
          rtypes.push(rtype);
          await rtype.load(threadId, SCHEMA_KIND_NODE_FUNC_ARG);
        }
        this._relations = rtypes;
      }
    }
  }

  unload(): void {
    this._payload = undefined;
  }

  *getRefTypes(): Generator<INodeType> {
    if (this._payload) yield this._payload;
    yield* super.getRefTypes();
  }
  
  /** Get the value type for the given access path. */
  getAccessValueType(path: string): IValueTypeAccess | undefined {
    const access = splitString(path, ".", 2);
    if (access[0].toLowerCase() === FUNC_RETURN) return this.payload;

    const arg = this._args?.find(arg => arg.name.toLowerCase() === access[0].toLowerCase());
    if (arg) return arg.type;
    return this._objectType; // pass relation check only, may handle it later
  }

  /** Get access entries for this function type. */
  getAccessEntries(): Entry<string>[] {
    const res: Entry<string>[] = [];
    res.push({ value: FUNC_RETURN, hasChildren: this.payload?.hasAccessEntries } as Entry<string>);
    for (const arg of this._args || []) { // no property field
      if (!arg.type) continue;
        const entry = { value: arg.name, hasChildren: false } as Entry<string>;
        res.push(setPropertyValue(entry, Display, arg.getPropertyValue(Display) ?? _LS(arg.name)));
    }
    return res;
  }

  /** Whether this function type has access entries. */
  get hasAccessEntries(): boolean {
    return true;
  }

  /** Get relations defined in this function. */
  *getRelations(): Generator<IRelation> {
    if (this._relations)
      yield* this._relations;
  }
  
  /** Whether this function type is assignable to the given type. */
  isAssignableTo(other: IValueTypeAccess): boolean {
    return false;
  }

  /** Create a new value instance for this type. */
  create(value: unknown, parent?: IValueAccess, propProvider?: IPropertyProvider): IValueAccess {
    throw new Error('Function type cannot be created.');
  }

  addConverter(other: IValueTypeAccess, converter: INodeType): void {}
  getConverter(other: IValueTypeAccess): INodeType | undefined { return undefined; }
  removeConverter(other: IValueTypeAccess, converter: INodeType): void {}

}
