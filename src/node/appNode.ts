import { DataNode, IConstraintProperty, IProperty, IRelationInfo, IValueAccess } from "schema-node-core";
import { AppType } from "../runtime/app/appType";

export class AppNode implements IValueAccess {
  private _appFields: DataNode[];

  constructor(appType: AppType, data: Record<string, unknown>) {
    
  }

  //#region IValueAccess

  get isEmpty(): boolean {
      throw new Error("Method not implemented.");
  }
  get rawValue(): unknown {
      throw new Error("Method not implemented.");
  }
  setValue(value: unknown): void {
      throw new Error("Method not implemented.");
  }
  getValue(): unknown {
      throw new Error("Method not implemented.");
  }
  getProperty(propCtor: new () => IProperty): IProperty | undefined {
      throw new Error("Method not implemented.");
  }
  getPropertyValue(propCtor: new () => IProperty): unknown {
      throw new Error("Method not implemented.");
  }
  getProperties(propCtor: new () => IProperty): Generator<IProperty> {
      throw new Error("Method not implemented.");
  }
  getPropertyValues(propCtor: new () => IProperty): Generator<unknown> {
      throw new Error("Method not implemented.");
  }
  setPropertyValue(propCtor: new () => IProperty, value?: unknown, source?: IValueAccess): void {
      throw new Error("Method not implemented.");
  }
  subscribe(func: Function, immediate?: boolean): Function {
      throw new Error("Method not implemented.");
  }
  subscribeState(func: Function, immediate?: boolean): Function {
      throw new Error("Method not implemented.");
  }
  subscribeProperty(propCtor: new () => IProperty, func: Function, immediate?: boolean): Function {
      throw new Error("Method not implemented.");
  }
  subscribeViolated(func: Function, immediate?: boolean): Function {
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
  confirm(): void {
      throw new Error("Method not implemented.");
  }
  reset(): void {
      throw new Error("Method not implemented.");
  }
  dispose(): void {
      throw new Error("Method not implemented.");
  }
  get changed(): boolean {
      throw new Error("Method not implemented.");
  }
  //#endregion
}