import { DataNode, Disable, IConstraintProperty, IProperty, IRelationInfo, isNull, IValueAccess, ReadOnly } from "schema-node-core";
import { AppType } from "../runtime/app/appType";
import { IAppDataQuery, IAppDataResult, IAppWorkflowState } from "../schema/provider/interface";
import { Loaded } from "../property";
import { DataRead } from "../property/app/dataRead";
``
/** The app node to manage all field data nodes */
export class AppNode implements IValueAccess {
  readonly appType: AppType;
  readonly target?: string;
  private _appFieldNodes: DataNode[];
  private _workflowStates?: IAppWorkflowState[];

  constructor(appType: AppType, target?: string, query?: IAppDataQuery, data: IAppDataResult | undefined = undefined, readonly = false) {
    this.appType = appType;
    this.target = target;
    this._appFieldNodes = [];
    this._workflowStates = data?.workflows;
    if (readonly) this.setPropertyValue(ReadOnly, true); // mark as readonly node

    // Generate the data nodes of fields
    for (const field of appType.getFields())
    {
      if (field.getPropertyValue(Disable) || field.getPropertyValue(DataRead) === false) continue;

      // Generate the data node
      const node = field.create(this, data?.results[field.name]);

      // loaded
      if (!node.isEmpty || !query?.fields?.length || query?.fields?.includes(field.name)) 
        node.setPropertyValue(Loaded, true, this);

      // readonly (it also may inherit readonly from field type)
      if (readonly) 
        node.setPropertyValue(ReadOnly, true, this);

      this._appFieldNodes.push(node);
    }
  }

  //#region fields

  private *_getFields(predicate: (node: DataNode) => boolean): Generator<DataNode> {
    for (const info of this._appFieldNodes.filter(predicate)) 
      yield info;
  }

  /** Get an application field by name */
  getfield(name: string): DataNode | undefined {
    return this._appFieldNodes.find(node => node.name.toLowerCase() === name.toLowerCase());
  }

  /** Get all application fields */
  get fields(): Generator<DataNode> { return this._getFields(() => true); }

  /** Get all application input fields */
  get inputFields(): Generator<DataNode> { return this._getFields(AppFieldNodeState.None, AppFieldNodeState.Push | AppFieldNodeState.Ref | AppFieldNodeState.FrontEnd); }

  /** Get all application input fields that are loaded */
  get loadedInputFields(): Generator<DataNode> { return this._getFields(AppFieldNodeState.Loaded, AppFieldNodeState.Push | AppFieldNodeState.Ref | AppFieldNodeState.FrontEnd); }

  /** Get all application push fields */
  get pushFields(): Generator<  > { return this._getFields(AppFieldNodeState.Push); }

  /** Get all application front end fields */
  get frontEndFields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.FrontEnd); }

  /** Get all application ref fields */
  get refFields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.Ref); }

  //#endregion

  //#region Status

  //#endregion

  // #region IValueAccess implementation

  // value access
  get isEmpty(): boolean { return this._appFieldNodes.length === 0; }
  get rawValue(): unknown { return undefined; }
  setValue(value: unknown): void { throw new Error("Can't set value to app node"); }
  getValue(): unknown { return undefined; }

  // property access
  getProperty(propCtor: new () => IProperty): IProperty | undefined { return this.appType.getProperty(propCtor); }
  getPropertyValue<T>(propCtor: new () => IProperty): T | undefined { return this.getProperty(propCtor)?.getValue() as T; }
  getProperties(propCtor: new () => IProperty): Generator<IProperty> { return this.appType.getProperties(propCtor); }
  *getPropertyValues<T>(propCtor: new () => IProperty): Generator<T> { for (const prop of this.getProperties(propCtor)) yield prop.getValue() as T; }
  setPropertyValue(propCtor: new () => IProperty, value?: unknown, source?: IValueAccess): void {}

  // subscription
  subscribe(func: Function, immediate?: boolean): Function { return () => {}; }
  recordSubscription(subscription: Function, source: unknown): void {}
  clearSubscription(source: unknown): void {}

  // access value
  getAccessValue(path: string, node?: IValueAccess): IValueAccess | undefined {
    const dotIndex = path.indexOf(".");
    let remain: string | undefined;
    if (dotIndex > 0) {
      remain = path.substring(dotIndex + 1);
      path = path.substring(0, dotIndex);
    }

    for (const field of this._appFieldNodes) {
      if (field.name.toLowerCase() === path.toLowerCase()) {
        return remain ? field.getAccessValue(remain, node) : field;
      }
    }

    return undefined;
  }
  get parent(): IValueAccess | undefined { return undefined; }

  // realtion & validation
  attachRelations(relationInfos: IRelationInfo[]): void {}
  get isValid(): boolean { return this._appFieldNodes.every(field => field.isValid); }
  *violated(): Generator<IConstraintProperty> { for (const field of this._appFieldNodes) yield* field.violated(); }
  recordConstraint(constraint: IConstraintProperty, valid: boolean): void {}
  // #endregion IValueAccess implementation

}