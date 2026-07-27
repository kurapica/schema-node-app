import { DataNode, IConstraintProperty, IProperty, IRelationInfo, isNull, IValueAccess, ReadOnly } from "schema-node-core";
import { AppType } from "../runtime/app/appType";
import { IAppDataQuery, IAppDataResult, IAppWorkflowState } from "../schema/provider/interface";
import { AppFieldType } from "../runtime/app/appFieldType";

// The app field node states
enum AppFieldNodeState {
  None = 0,
  Loaded = 1 << 0,
  Push = 1 << 1,
  Ref = 1 << 2,
  FrontEnd = 1 << 3,
  Readonly = 1 << 4,
}

/** The app node to manage all field data nodes */
export class AppNode implements IValueAccess {
  readonly appType: AppType;
  readonly target?: string;
  private _appFields: { field: AppFieldType, node: IValueAccess, loaded: AppFieldNodeState }[];
  private _workflowStates?: IAppWorkflowState[];

  constructor(appType: AppType, target?: string, query?: IAppDataQuery, data: IAppDataResult | undefined = undefined, readonly = false) {
    this.appType = appType;
    this.target = target;
    this._appFields = [];
    this._workflowStates = data?.workflows;
    if (readonly) this.setPropertyValue(ReadOnly, true);

    for (const field of appType.getFields())
    {
      const finfo = data?.infos[field.name];
      if (field.disable || (finfo && !finfo.allowRead)) continue;
      
      //#region The node state
      const d = data?.results[field.name];
      let state = AppFieldNodeState.None;
      
      // loaded
      if (!isNull(d) || data?.infos[field.name])
        state |= AppFieldNodeState.Loaded;

      // push field
      if (field.pushSource) state |= AppFieldNodeState.Push | AppFieldNodeState.Readonly;

      // display only field
      if (!field.enableStorage) state |= AppFieldNodeState.Readonly 
        | AppFieldNodeState.FrontEnd
        | AppFieldNodeState.Loaded;

      // view
      if (field.view) state |= AppFieldNodeState.Ref | AppFieldNodeState.Readonly;

      //#endregion
      const readonlyField = readonly || state & AppFieldNodeState.Readonly || (finfo && !finfo.allowUpdate);
      const node = field.create(this, d);
      if (readonlyField) node.setPropertyValue(ReadOnly, true, this);
      this._appFields.push({field, node, loaded: state});
    }
  }

  //#region IValueAccess

  get isEmpty(): boolean { return false; }

  get rawValue(): unknown { return undefined; }

  setValue(value: unknown): void { }
  
  getValue(): unknown { return undefined; }

  getProperty(propCtor: new () => IProperty): IProperty | undefined {
      throw new Error("Method not implemented.");
  }
  getPropertyValue<T>(propCtor: new () => IProperty): T | undefined {
      throw new Error("Method not implemented.");
  }
  getProperties(propCtor: new () => IProperty): Generator<IProperty> {
      throw new Error("Method not implemented.");
  }
  getPropertyValues<T>(propCtor: new () => IProperty): Generator<T> {
      throw new Error("Method not implemented.");
  }
  setPropertyValue(propCtor: new () => IProperty, value?: unknown, source?: IValueAccess): void {
      throw new Error("Method not implemented.");
  }
  subscribe(func: Function, immediate?: boolean): Function {
      throw new Error("Method not implemented.");
  }
  recordSubscription(subscription: Function, source: unknown): void {
      throw new Error("Method not implemented.");
  }
  clearSubscription(source: unknown): void {
      throw new Error("Method not implemented.");
  }
  getAccessValue(path: string, node?: IValueAccess): IValueAccess | undefined {
      throw new Error("Method not implemented.");
  }
  get parent(): IValueAccess {
      throw new Error("Method not implemented.");
  }
  attachRelations(relationInfos: IRelationInfo[]): void {
      throw new Error("Method not implemented.");
  }
  get isValid(): boolean {
      throw new Error("Method not implemented.");
  }
  violated(): Generator<IConstraintProperty> {
      throw new Error("Method not implemented.");
  }
  recordConstraint(constraint: IConstraintProperty, valid: boolean): void {
      throw new Error("Method not implemented.");
  }

  //#endregion
}