import { DataNode, StructNode, FunctionType, StringNode, ApplyMode, type CallArg, StructType, Observable, type IValueAccess, ArrayType, type IPropertyProvider, type Observer, FUNC_RETURN, splitString, ARRAY_ELEMENT, type ValueAccessFactory, type LocaleString, Display, _LS, ReadOnly, AccessEntryConsumer, buildFuncCall, NS_SYSTEM_SCHEMA_REFLECT_TYPE, NODE_SELF, SystemReflectType } from "schema-node-core";
import { WorkflowVarNode } from "./workflowVarNode";
import type { WorkflowType } from "../../workflow/runtime";
import { WorkflowArgNode } from "./workflowArgNode";

/** The workflow expression arguments data node */
export class WorkflowArgsNode extends DataNode implements Iterable<StructNode> {
  private _args: StructNode[] = [];
  private _varArg: WorkflowVarNode | undefined;

  private _workflowType: WorkflowType | undefined;
  private _return: StringNode | undefined;
  private _mode: ApplyMode | undefined;
  private _initData: CallArg[] | undefined;
  private _argType: StructType
  private _argCountOb?: Observable<[IValueAccess, number]>;
  private _preColIdx: number = -1;

  constructor(type: ArrayType, value: unknown, parent?: IValueAccess, ...propProviders: IPropertyProvider[]) {
    super(type, undefined, parent, ...propProviders);
    this._return = (this.parent!.getAccessValue('payload') as StringNode)!;
    this._argType = type.element as StructType;
    this._initData = value as CallArg[] ?? []; // waiting parent
  }

  override dispose() {
    this._argCountOb?.dispose();
    delete this._argCountOb;

    this._args.forEach(e => e.dispose());
    this._args = [];

    this._varArg?.dispose();
    this._varArg = undefined;

    super.dispose();
  }

  // #region ── Method ────────────────────────────────────────────────────────

  /** Workflow => Arguments. */
  refreshWorkflow(workflowType: WorkflowType | undefined) {
    if (workflowType == this._workflowType) return;
    this._workflowType = workflowType;
    this.rebuildArgs();
  }

  // #endregion

  // #region ── Value Access ───────────────────────────────────────────────

  override get isEmpty() {
    return this._args.length == 0 && (this._varArg?.isEmpty ?? true);
  }

  override setValue(value: unknown) {
    this._initData = value as CallArg[] ?? [];
    this.rebuildArgs();
  }

  override getValue(): unknown {
    if (this._initData) return this._initData;

    const result: CallArg[] = this._args.map(e => e.getValue() as CallArg);
    if (this._varArg) result.push(...this._varArg.getValue() as CallArg[]);

    return result;
  }

  override get submitValue() {
    if (this._initData) return this._initData;

    const result: CallArg[] = this._args.map(e => e.submitValue as CallArg);
    if (this._varArg) result.push(...this._varArg.submitValue as CallArg[]);

    return result;
  }

  override get changed() { return this._args.some(e => e.changed) || this._varArg?.changed || false; }

  override get isValid() { return this._args.every(e => e.isValid) && (this._varArg?.isValid ?? true); }

  override get error() { return this._args.find(e => e.error)?.error ?? this._varArg?.error; }

  override *getErrorNodes() {
    for(let e of this._args) 
      yield* e.getErrorNodes();
    if (this._varArg)
      yield* this._varArg.getErrorNodes();
  }

  override confirm(): void {
    this._args.forEach(e => e.confirm());
    this._varArg?.confirm();
  }

  // #endregion

  // #region ── Args Changed ───────────────────────────────────────────────

  /** Subscribe the array item change and return the function for un-subsribe, normally for element subscribe previous nodes */
  subscribeArgs(func: Observer<[IValueAccess, number]>, immediate?: boolean): Function {
    this._argCountOb ??= new Observable();
    const sub = this._argCountOb.subscribe(func);
    if (immediate) func(this, this.length);
    return sub;
  }

  /** Publish the array item change */
  onNextArgs() {
    this._argCountOb?.onNext(this, this.length);
  }

  // #endregion

  // #region ── Path Navigation ───────────────────────────────────────────────

  // special for argument choice
  override getAccessValue(path: string, node?: IValueAccess): IValueAccess | undefined {
    const g = super.getAccessValue(path, node);
    if (g) return g;

    if (!path?.length) return undefined;
    path = path.toLowerCase();
    if (path === FUNC_RETURN) return this._return ?? this.parent?.getAccessValue('funcReturn');

    const paths = splitString(path, '.', 2);
    if (paths[0] == ARRAY_ELEMENT) {
      let item = node;
      while (item && item.parent != this)
        item = item.parent;
      return paths.length == 1 ? item : item?.getAccessValue(paths[1]);
    }

    const arg = this.at(paths[0]);
    if (!arg) return undefined;
    if (arg instanceof WorkflowVarNode) 
      return paths.length == 1 ? arg : undefined; // only support direct access for variadic argument
    return arg.getAccessValue(paths[1]);
  }

  // #endregion

  // #region ── Iterable ───────────────────────────────────────────────────────

  private *_getArgs(): Generator<StructNode> {
    yield* this._args;
    if (this._varArg)
      yield* this._varArg;
  }

  /** Gets the arguments & variadic argument */
  [Symbol.iterator](): Iterator<StructNode> { return this._getArgs(); }

  /** Gets the length of the arguments */
  get length(): number { return this._args.length + (this._varArg?.length ?? 0); }

  /** Gets the argument at the given index */
  at(index: number | string): DataNode | undefined {
    if (typeof index === 'number') return index >= this._args.length ? this._varArg?.at(index - this._args.length) : this._args[index];
    return this._args.find(e => e.name?.toLowerCase() == index.toLowerCase()) 
      ?? (this._varArg?.name?.toLowerCase() == index.toLowerCase() ? this._varArg : undefined);
  }

  /** Gets the variadic argument */
  get variadicArg(): WorkflowVarNode | undefined { return this._varArg; }

  // #endregion

  // #region ── Utility ───────────────────────────────────────────────────────

  /** Add a new element to the array */
  private addRow(data: unknown, propertyProvider: IPropertyProvider, factory?: ValueAccessFactory): StructNode | undefined {
    const node = factory 
      ? new factory(this._argType, data, this, propertyProvider, ...this.propertyProviders) as StructNode 
      : this._argType.create(data, this, propertyProvider, ...this.propertyProviders) as StructNode;
    if (!node) return undefined;

    this._args.push(node);
    node.applyPropertyEffects();
    return node;
  }

  /** Rebuild the arguments */
  private rebuildArgs() {
    const data: CallArg[] = this._initData ?? this.submitValue as CallArg[];
    let readonly = false;
    let node: DataNode = this;
    while (node && !node.readonly && node.parent instanceof DataNode)
      node = node.parent;
    readonly = node?.readonly ?? false;

    this._args.forEach(e => e.dispose());
    this._args = [];

    this._varArg?.dispose();
    this._varArg = undefined;

    this._preColIdx = -1;

    if (!this._workflowType || this._workflowType.isGeneric) return;
    delete this._initData;

    super.setValue(data);

    // refresh the arguments
    for (let i = 0; i < (this._workflowType.args?.length ?? 0); i++)
    {
      const arg = this._workflowType.args.at(i)!;
      if (arg.variadic)
      {
        const adata = data.slice(i);
        const argName = arg.getPropertyValue<LocaleString>(Display) ?? _LS(arg.name);
        if (!adata.length && !readonly) adata.push({ name: argName, type: arg.type?.name });
        adata.forEach(a => { a.type = arg.type?.name; a.name = argName; });
        const node = new WorkflowVarNode(this._argType, adata, this, arg);
        if (readonly)
          node.setPropertyValue(ReadOnly, true);
        else {
          node.recordSubscription(node.subscribeArgs(() => this.onNextArgs()));
          node.recordSubscription(node.subscribe(this.writeBackRawValue));
        }
        this._varArg = node;
        if (this._mode !== ApplyMode.Call) {
          node.setCollectionSelectable(true);
          node.recordSubscription(node.subscribe(() => this.refreshArgTypes()));
        }
        break; // variadic arguments are the last
      }
      else
      {
        const argName = arg.getPropertyValue<LocaleString>(Display) ?? _LS(arg.name);
        const adata = typeof data[i] === 'object' ? { ...data[i], name: argName, type: arg.type?.name } : { name: argName, type: arg.type?.name };
        const node = this.addRow(adata, arg, WorkflowArgNode)!;

        if (readonly)
          node.setPropertyValue(ReadOnly, true);
        else { 
          node.recordSubscription(node.subscribe(this.writeBackRawValue));
          if (this._mode !== ApplyMode.Call) {
            node.getAccessValue('source')!.setPropertyValue(AccessEntryConsumer, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.isassignableto`, NODE_SELF, true, `@${ARRAY_ELEMENT}.type`), node.parent);
            node.recordSubscription(node.subscribe(() => this.refreshArgTypes()));
          }
        }
      }
    }

    // attach the function relations
    for (const e of this._args) this.applyFuncRelations(e);
    if (this._varArg) this.applyFuncRelations(this._varArg);

    this.onNextArgs();
  }

  private applyFuncRelations(arg: DataNode){
    const n = arg.name?.toLowerCase() ?? '';
    if (!n || !this._workflowType) return;
    const r = Array.from(this._workflowType.getRelations().filter(r => r.target.toLowerCase() == n || r.target.toLowerCase().startsWith(`${n}.`)));
    if (r.length) arg.attachRelations([{ owner: this, relations: r }]);
  }

  /** Refresh the argument types */
  private async refreshArgTypes() {
    let colIdx = -1;
    for (let i = 0; i < this._args.length; i++) {
      const e = this._args[i];
      const type = (e.rawValue! as any)?.type;
      const source = (e.rawValue! as any)?.sourceType;
      if (source && type && source !== type)
      {
        if (await SystemReflectType.isassignableto(source, false, type))
          continue;
        if (await SystemReflectType.isassignableto(source, true, type))
        {
          colIdx = i;
          break;
        }
      }
    }
    if (colIdx < 0 && this._varArg?.length)
    {
      const e = this._varArg.at(0)!;
      const type = (e.rawValue! as any)?.type;
      const source = (e.rawValue! as any)?.sourceType;
      if (source && type && source !== type)
      {
        if (!await SystemReflectType.isassignableto(source, false, type) && await SystemReflectType.isassignableto(source, true, type))
          colIdx = this._args.length;
      }
    }
    if (colIdx != this._preColIdx)
    {
      for (let i = 0; i < this._args.length; i++)
      {
        const node = this._args[i];
        node.getAccessValue('source')!.setPropertyValue(AccessEntryConsumer, colIdx < 0 || colIdx == i ? buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.isassignableto`, NODE_SELF, true, `@${ARRAY_ELEMENT}.type`) : undefined, node.parent);
      }
      this._preColIdx = colIdx;
      if (colIdx >= 0 && colIdx < this._args.length)
        this._varArg?.setCollectionSelectable(false);
      else if (colIdx < 0)
        this._varArg?.setCollectionSelectable(true);
    }
  }

  /** Write back the raw value to the array of arguments */
  private writeBackRawValue = (element: IValueAccess, value: unknown) => {
    const arr = this.rawValue as unknown[];
    if (!Array.isArray(arr)) return;

    const idx = this._args.indexOf(element as StructNode);
    if (idx >= 0) {
      arr[idx] = value;
      this.onNext();
    }
    else if (this._varArg == element && Array.isArray(value))
    {
      arr.splice(this._args.length, Math.max(0, arr.length - this._args.length), ...value);
      this.onNext();
    }
  }

  // #endregion
}
