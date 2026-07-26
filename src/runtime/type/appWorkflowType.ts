import type { AppType } from "./appType";
import type { AppWorkflowSchema, AppWorkflowNodeSchema } from "../../schema/app/appWorkflowSchema";
import type { NodeType, ValueType, IProperty } from "schema-node-core";

export class AppWorkflowType {
  private readonly _appWorkflowSchema: AppWorkflowSchema;
  private _props?: IProperty[];
  private _refTypes?: NodeType[];

  constructor(app: AppType, schema: AppWorkflowSchema) {
    this.application = app;
    this._appWorkflowSchema = schema;
  }

  readonly application: AppType;

  get app(): string { return this.application.name; }

  get seqno(): number { return this._appWorkflowSchema.seqno ?? 0; }

  get name(): string { return this._appWorkflowSchema.name; }

  get active(): boolean { return this._active; }
  private _active = false;

  get nodes(): AppWorkflowNodeSchema[] { return this._nodes; }
  private _nodes: AppWorkflowNodeSchema[] = [];

  get error(): string | undefined { return this._error; }
  private _error?: string;

  private _activated = 0;
  get activated(): boolean { return this._activated > 0; }

  *getRefTypes(): Generator<NodeType> {
    for (const node of this._nodes) {
      if (node.payloadValueType) yield node.payloadValueType;
    }
    if (this._refTypes) yield* this._refTypes;
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

  getPropertyByName(propertyName: string): IProperty | undefined {
    return this._props?.find(p => p.name.toLowerCase() === propertyName.toLowerCase());
  }

  getSchema(): AppWorkflowSchema {
    return {
      app: this._appWorkflowSchema.app,
      name: this._appWorkflowSchema.name,
      seqno: this._appWorkflowSchema.seqno,
      active: this._appWorkflowSchema.active,
      nodes: this._appWorkflowSchema.nodes.map(n => ({
        name: n.name,
        type: n.type,
        payload: n.payload,
        args: n.args?.map(a => ({ ...a })),
        previous: n.previous,
        state: n.state,
        fork: n.fork,
        forkKey: n.forkKey,
        unCancelable: n.unCancelable,
        cancelPre: n.cancelPre,
        savePayload: n.savePayload,
      })),
    };
  }
}