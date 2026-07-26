import { getPropertiesBySchemaKind, IProperty, NodeType } from "schema-node-core";
import { WorkflowSchema } from "../../schema/type/workflowSchema";
import { WorkflowProperty } from "../../schema/type/workflowSchema";
import { ValueType } from "schema-node-core";
import { getNodeType } from "schema-node-core";
import { SCHEMA_KIND_WORKFLOW, WORKFLOW_KIND_WORKFLOW } from "../../utils/constant";

export class WorkflowType extends NodeType {
  private _workflowSchema?: WorkflowSchema;

  get payload(): ValueType | undefined { return this._payload; }
  private _payload?: ValueType;

  get state(): ValueType | undefined { return this._state; }
  private _state?: ValueType;

  get session(): ValueType | undefined { return this._session; }
  private _session?: ValueType;

  get args(): { name: string; type: string }[] | undefined { return this._workflowSchema?.args; }

  get workflowKind(): string { return this._workflowSchema?.kind ?? WORKFLOW_KIND_WORKFLOW; }

  override loadProperties(): IProperty[] {
    this._workflowSchema = this.getProperty(WorkflowProperty)?.getValue();
    return this._workflowSchema ? Array.from(getPropertiesBySchemaKind(this._workflowSchema, SCHEMA_KIND_WORKFLOW)) : [];
  }

  override async load() {
    if (this._workflowSchema?.payload) {
      this._payload = await getNodeType(this._workflowSchema.payload) as ValueType;
    }

    if (this._workflowSchema?.settings) {
      this._state = await getNodeType(this._workflowSchema.settings) as ValueType;
    }

    if (this._workflowSchema?.session) {
      this._session = await getNodeType(this._workflowSchema.session) as ValueType;
    }
  }

  unload(): void {
    this._payload = undefined;
    this._state = undefined;
    this._session = undefined;
  }

  *getRefTypes(): Generator<NodeType> {
    if (this._payload) yield this._payload;
    if (this._state) yield this._state;
    if (this._session) yield this._session;
    yield* super.getRefTypes();
  }
}