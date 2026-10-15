import { getPropertiesBySchemaKind, NodeType, ValueType, getNodeType, NS_SYSTEM_OBJECT, getProperty, Relations, type RelationSchema, RelationType, SCHEMA_KIND_NODE_FUNC_ARG, _LS, Display, type Entry, FUNC_RETURN, type IPropertyProvider, type IValueAccess, setPropertyValue, splitString, getPropertyValue } from "schema-node-core";

import { FunArgsType, type INodeType, type IProperty, type IRelation, type IRelationProvider, type IValueTypeAccess } from "schema-node-core";
import type { WorkflowSchema } from "./type";

import { SCHEMA_KIND_NODE_WORKFLOW, WORKFLOW_KIND_WORKFLOW } from "../../utils/constant";

export class WorkflowType extends NodeType implements IValueTypeAccess, IRelationProvider{
  private _workflowSchema?: WorkflowSchema;
  private _relations: IRelation[] | undefined;
  private _args?: FunArgsType;
  private _objectType: IValueTypeAccess | undefined;

  get payload(): ValueType | undefined { return this._payload; }
  private _payload?: ValueType;

  get state(): ValueType | undefined { return this._state; }
  private _state?: ValueType;

  get session(): ValueType | undefined { return this._session; }
  private _session?: ValueType;

  /** Argument definitions. */
  get args(): FunArgsType { return this._args! }  

  get workflowKind(): string { return this._workflowSchema?.kind ?? WORKFLOW_KIND_WORKFLOW; }

  override loadProperties(): IProperty[] {
    this._workflowSchema = getPropertyValue<WorkflowSchema>(this.getNodeSchema(), "workflow");
    return this._workflowSchema ? Array.from(getPropertiesBySchemaKind(this._workflowSchema, SCHEMA_KIND_NODE_WORKFLOW)) : [];
  }

  override async load(threadId?: string) {
    this._args = new FunArgsType(this._workflowSchema.args ?? []);
    await this._args.load(this.generics, this.genericParams, threadId);
    
    this._objectType = await getNodeType(NS_SYSTEM_OBJECT, undefined, undefined, undefined, threadId) as unknown as IValueTypeAccess;

    if (this._workflowSchema?.payload) {
      this._payload = await getNodeType(this._workflowSchema.payload,  this.generics, this.genericParams, undefined, threadId) as ValueType;
    }

    if (this._workflowSchema?.settings) {
      this._state = await getNodeType(this._workflowSchema.settings,  this.generics, this.genericParams, undefined, threadId) as ValueType;
    }

    if (this._workflowSchema?.session) {
      this._session = await getNodeType(this._workflowSchema.session,  this.generics, this.genericParams, undefined, threadId) as ValueType;
    }
    
    // Load relations from Relations property
    if (!this.isGeneric) {
      const relations = getProperty(this._workflowSchema, Relations)?.getValue<RelationSchema[]>();
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
    this._state = undefined;
    this._session = undefined;
  }

  *getRefTypes(): Generator<INodeType> {
    if (this._payload) yield this._payload;
    if (this._state) yield this._state;
    if (this._session) yield this._session;
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
