import { IConstraintProperty, IProperty, IRelationInfo, isNull, IValueAccess, ReadOnly } from "schema-node-core";
import { AppType } from "../runtime/app/appType";
import { IAppDataQuery, IAppDataResult, IAppWorkflowState } from "../schema/provider/interface";
import { AppFieldType } from "../runtime/app/appFieldType";
import { Loaded } from "../property";
import { DataRead } from "../property/app/dataRead";
import { DataUpdate } from "../property/app/dataUpdate";

// The app field node states
enum AppFieldNodeState {
  None = 0,
  Loaded = 1 << 0,
  Push = 1 << 1,
  Ref = 1 << 2,
  FrontEnd = 1 << 3,
  Readonly = 1 << 4,
}

interface AppFieldNodeInfo {
  field: AppFieldType;
  node: IValueAccess;
  state: AppFieldNodeState;
}

/** The app node to manage all field data nodes */
export class AppNode implements IValueAccess {
  readonly appType: AppType;
  readonly target?: string;
  private _appFields: AppFieldNodeInfo[];
  private _workflowStates?: IAppWorkflowState[];

  constructor(appType: AppType, target?: string, query?: IAppDataQuery, data: IAppDataResult | undefined = undefined, readonly = false) {
    this.appType = appType;
    this.target = target;
    this._appFields = [];
    this._workflowStates = data?.workflows;
    if (readonly) this.setPropertyValue(ReadOnly, true); // mark as readonly node

    // Generate the data nodes of fields
    for (const field of appType.getFields())
    {
      if (field.disable || field.getPropertyValue<boolean>(DataRead) === false) continue;

      // The node state, @TODO: should I convert the state to node propety?
      const d = data?.results[field.name];

      // Generate the data node
      const node = field.create(this, d);

      // loaded
      if (!node.isEmpty || !query?.fields?.length || query?.fields?.includes(field.name)) 
        node.setPropertyValue(Loaded, true, this);

      // readonly
      if (readonly || field.getPropertyValue<boolean>(DataUpdate) === false || !field.enableStorage || field.pushSource || field.view)
        node.setPropertyValue(ReadOnly, true, this);
      
      let state = AppFieldNodeState.None;
      {
        // readonly
        if (readonly || field.getPropertyValue<boolean>(DataUpdate) === false) 
          state |= AppFieldNodeState.Readonly;
        
        // loaded
        if (!isNull(d) || data?.infos[field.name])
            state |= AppFieldNodeState.Loaded;

        // push field
        if (field.pushSource) state |= AppFieldNodeState.Push | AppFieldNodeState.Readonly;

        // display only field
        if (!field.enableStorage) state |= AppFieldNodeState.Readonly | AppFieldNodeState.FrontEnd | AppFieldNodeState.Loaded;

        // view
        if (field.view) state |= AppFieldNodeState.Ref | AppFieldNodeState.Readonly;
      }

      if (state & AppFieldNodeState.Readonly)
        node.setPropertyValue(ReadOnly, true, this);
      if (state & AppFieldNodeState.Loaded)
        node.setPropertyValue(Loaded, true, this);
      
      this._appFields.push({field, node, state});
    }
  }

  //#region fields

  private *_getFields(state: AppFieldNodeState, nostate?: AppFieldNodeState): Generator<IValueAccess> {
    for (const info of this._appFields.filter(info => (!state || (info.state & state) === state) && !(info.state & (nostate ?? 0)))) 
      yield info.node;
  }

  /** Get an application field by name */
  getfield(name: string): IValueAccess | undefined {
    return this._appFields.find(info => info.field.name.toLowerCase() === name.toLowerCase())?.node;
  }

  /** Get all application fields */
  get fields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.None); }

  /** Get all application input fields */
  get inputFields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.None, AppFieldNodeState.Push | AppFieldNodeState.Ref | AppFieldNodeState.FrontEnd); }

  /** Get all application input fields that are loaded */
  get loadedInputFields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.Loaded, AppFieldNodeState.Push | AppFieldNodeState.Ref | AppFieldNodeState.FrontEnd); }

  /** Get all application push fields */
  get pushFields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.Push); }

  /** Get all application front end fields */
  get frontEndFields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.FrontEnd); }

  /** Get all application ref fields */
  get refFields(): Generator<IValueAccess> { return this._getFields(AppFieldNodeState.Ref); }

  //#endregion

  //#region Status

  //#endregion

  // #region IValueAccess implementation

  // value access
  get isEmpty(): boolean { return this._appFields.length === 0; }
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

    for (const field of this._appFields) {
      if (field.field.name.toLowerCase() === path.toLowerCase()) {
        return remain ? field.node.getAccessValue(remain, node) : field.node;
      }
    }

    return undefined;
  }
  get parent(): IValueAccess | undefined { return undefined; }

  // realtion & validation
  attachRelations(relationInfos: IRelationInfo[]): void {}
  get isValid(): boolean { return this._appFields.every(field => field.node.isValid); }
  *violated(): Generator<IConstraintProperty> { for (const field of this._appFields) yield* field.node.violated(); }
  recordConstraint(constraint: IConstraintProperty, valid: boolean): void {}
  // #endregion IValueAccess implementation

}