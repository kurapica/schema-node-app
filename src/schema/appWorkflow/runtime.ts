import { getNodeType, getPropertiesBySchemaKind, deepClone } from "schema-node-core";

import type { NodeType, ValueType, IProperty } from "schema-node-core";
import type { AppWorkflowSchema, AppWorkflowNodeSchema } from "./type";
import type { IAppType, IAppWorkflowType } from "../app/type";

import { SCHEMA_KIND_APP_WORKFLOW } from "../../utils/constant";

/** The type of the application workflow. */
export class AppWorkflowType implements IAppWorkflowType {
  private readonly _appWorkflowSchema: AppWorkflowSchema;
  private _props?: IProperty[];

  constructor(app: IAppType, schema: AppWorkflowSchema) {
    this.application = app;
    this._appWorkflowSchema = schema;
  }

  /** The application of the workflow. */
  readonly application: IAppType;

  /** The name of the application. */
  get app(): string { return this.application.name; }

  /** The name of the workflow. */
  get name(): string { return this._appWorkflowSchema.name; }

  /** Whether the workflow is active. */
  get active(): boolean { return this._appWorkflowSchema.active; }

  /** The nodes of the workflow. */
  get nodes(): AppWorkflowNodeSchema[] { return this._appWorkflowSchema.nodes; }

  /** The error message of the workflow. */
  get error(): string | undefined { return this._appWorkflowSchema.error; }

  /** The schema of the workflow. */
  getWorkflowSchema(): AppWorkflowSchema { return deepClone(this._appWorkflowSchema); }

  /** Load the workflow. */
  async load() {
    this._props = Array.from(getPropertiesBySchemaKind(this._appWorkflowSchema, SCHEMA_KIND_APP_WORKFLOW));

    for (const node of this._appWorkflowSchema.nodes) {
      if (node.payload) {
        node.payloadValueType = await getNodeType(node.payload) as ValueType;
      }
    }
  }

  /** The reference types of the workflow. */
  *getRefTypes(): Generator<NodeType> {
    for (const node of this._appWorkflowSchema.nodes) {
      if (node.payloadValueType) yield node.payloadValueType;
    }
  }

  /** The property of the workflow. */
  getProperty<T extends IProperty>(propCtor: new () => T): T | undefined {
    return this._props?.find(p => p instanceof propCtor) as T;
  }

  /** The properties of the workflow. */
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
