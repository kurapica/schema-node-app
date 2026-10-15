import { DataNode, StructNode,  StringNode, type CallArg, StructType, Observable, type IValueAccess, ArrayType, type IPropertyProvider, type Observer, FUNC_RETURN, splitString, ARRAY_ELEMENT, type ValueAccessFactory, type LocaleString, Display, _LS, ReadOnly } from "schema-node-core";
import type { EventType } from "../runtime";
import { EventDeclareArgNode } from "./eventDeclareArgNode";

/** The function expression arguments data node */
export class EventDeclareArgsNode extends DataNode implements Iterable<StructNode> {
  private _args: StructNode[] = [];

  private _eventType: EventType | undefined;
  private _return: StringNode | undefined;
  private _initData: CallArg[] | undefined;
  private _argType: StructType
  private _argCountOb?: Observable<[IValueAccess, number]>;

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

    super.dispose();
  }

  // #region ── Method ────────────────────────────────────────────────────────

  /** Event => Arguments. */
  refreshEvent(eventType: EventType | undefined) {
    if (eventType == this._eventType) return;
    this._eventType = eventType;
    this.rebuildArgs();
  }

  // #endregion

  // #region ── Value Access ───────────────────────────────────────────────

  override get isEmpty() {
    return this._args.length == 0;
  }

  override setValue(value: unknown) {
    this._initData = value as CallArg[] ?? [];
    this.rebuildArgs();
  }

  override getValue(): unknown {
    if (this._initData) return this._initData;
    return this._args.map(e => e.getValue() as CallArg);
  }

  override get submitValue() {
    if (this._initData) return this._initData;
    return this._args.map(e => e.submitValue as CallArg);
  }

  override get changed() { return this._args.some(e => e.changed); }

  override get isValid() { return this._args.every(e => e.isValid); }

  override get error() { return this._args.find(e => e.error)?.error; }

  override *getErrorNodes() {
    for(let e of this._args) 
      yield* e.getErrorNodes();
  }

  override confirm(): void {
    this._args.forEach(e => e.confirm());
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
    return arg.getAccessValue(paths[1]);
  }

  // #endregion

  // #region ── Iterable ───────────────────────────────────────────────────────

  private *_getArgs(): Generator<StructNode> {
    yield* this._args;
  }

  /** Gets the arguments & variadic argument */
  [Symbol.iterator](): Iterator<StructNode> { return this._getArgs(); }

  /** Gets the length of the arguments */
  get length(): number { return this._args.length; }

  /** Gets the argument at the given index */
  at(index: number | string): DataNode | undefined {
    if (typeof index === 'number') return index >= this._args.length ? undefined : this._args[index];
    return this._args.find(e => e.name?.toLowerCase() == index.toLowerCase());
  }

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

    if (!this._eventType || this._eventType.isGeneric) return;
    delete this._initData;

    super.setValue(data);

    // refresh the arguments
    for (let i = 0; i < (this._eventType.args?.length ?? 0); i++)
    {
      const arg = this._eventType.args.at(i)!;
      const argName = arg.getPropertyValue<LocaleString>(Display) ?? _LS(arg.name);
      const adata = typeof data[i] === 'object' ? { ...data[i], name: argName, type: arg.type?.name } : { name: argName, type: arg.type?.name };
      const node = this.addRow(adata, arg, EventDeclareArgNode)!;

      if (readonly)
        node.setPropertyValue(ReadOnly, true);
      else { 
        node.recordSubscription(node.subscribe(this.writeBackRawValue));
      }
    }

    // attach the function relations
    for (const e of this._args) this.applyFuncRelations(e);

    this.onNextArgs();
  }

  private applyFuncRelations(arg: DataNode){
    const n = arg.name?.toLowerCase() ?? '';
    if (!n || !this._eventType) return;
    const r = Array.from(this._eventType.getRelations().filter(r => r.target.toLowerCase() == n || r.target.toLowerCase().startsWith(`${n}.`)));
    if (r.length) arg.attachRelations([{ owner: this, relations: r }]);
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
  }

  // #endregion
}
