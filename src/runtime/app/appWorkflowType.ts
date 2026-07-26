import type { AppType } from "./appType";
import type { AppWorkflowSchema, AppWorkflowNodeSchema } from "../../schema/app/appWorkflowSchema";
import { type NodeType, type ValueType, type IProperty, getNodeType } from "schema-node-core";

export class AppWorkflowType {
  private readonly _appWorkflowSchema: AppWorkflowSchema;
  private _props?: IProperty[];

  constructor(app: AppType, schema: AppWorkflowSchema) {
    this.application = app;
    this._appWorkflowSchema = schema;
  }

  readonly application: AppType;

  get app(): string { return this.application.name; }

  get name(): string { return this._appWorkflowSchema.name; }

  get active(): boolean { return this._appWorkflowSchema.active; }

  get nodes(): AppWorkflowNodeSchema[] { return this._appWorkflowSchema.nodes; }

  get error(): string | undefined { return this._appWorkflowSchema.error; }

  async load() {
    for (const node of this._appWorkflowSchema.nodes) {
      if (node.payload) {
        node.payloadValueType = await getNodeType(node.payload) as ValueType;
      }
    }
  }

  *getRefTypes(): Generator<NodeType> {
    for (const node of this._appWorkflowSchema.nodes) {
      if (node.payloadValueType) yield node.payloadValueType;
    }
  }

  getProperty<T extends IProperty>(propCtor: new () => T): T | undefined {
    return this._props?.find(p => p instanceof propCtor) as T;
  }

  *getProperties<T extends IProperty>(propCtor: new () => T): Generator<T> {
    if (this._props) {
      for (const prop of this._props) {
        if (prop instanceof propCtor) {
          yield prop;
          if (!prop.stackable) return;
        }
      }
    }
  }
}