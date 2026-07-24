import { Append, Attach, CallArg, Description, Display, ENTITY_PRIMARY_KEY_MAX_LEN, Meta, NS_SYSTEM_BOOL, NS_SYSTEM_LIST, NS_SYSTEM_OBJECT, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_SCHEMA_NODE_VALUE_KIND, NS_SYSTEM_STRING, PrimaryIndex, Require, SchemaKind, SchemaType, UpLimitString } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW_NODE, SCHEMA_KIND_ORDER_APP_WORKFLOW, SCHEMA_KIND_ORDER_APP_WORKFLOW_NODE } from "../../utils/constant";

/** The application workflow schema */
export interface AppWorkflowSchema {
  /** The application name */
  app: string;

  /** The name of the workflow */
  name: string;

  /** Whether the workflow is active */
  active: boolean;

  /** The workflow nodes */
  nodes: AppWorkflowNodeSchema[];
}

/** The application workflow node schema */
export interface AppWorkflowNodeSchema {
  /** The workflow node name */
  name: string;

  /** The workflow node type */
  type: string;

  /** The workflow node payload */
  payload: string;

  /** The workflow node arguments */
  args?: CallArg[];

  /** The workflow node previous nodes */
  previous?: string[];

  /** The workflow node state */
  state?: unknown;

  /** Fork the workflow node for multiple instances */
  fork?: boolean;

  /** The fork key paths in the payload */
  forkKey?: string[];

  /** Whether the workflow node is un cancelable */
  unCancelable?: boolean;

  /** Whether the previous fork branches should be canceled */
  cancelPre?: boolean;

  /** Whether the payload node data should be saved */
  savePayload?: boolean;

  /** The error message */
  error?: string;
}

@Meta(SchemaKind, [SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_ORDER_APP_WORKFLOW])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_WORKFLOW}.schema`)
@Meta(Append, [Display, Description])
@Meta(Attach, SCHEMA_KIND_APP_WORKFLOW)
class AppWorkflowSchemaMata implements AppWorkflowSchema {
  /** The application name */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  app: string;

  /** The name of the workflow */
  @Meta(SchemaType, NS_SYSTEM_STRING)
  @Meta(UpLimitString, ENTITY_PRIMARY_KEY_MAX_LEN)
  @Meta(PrimaryIndex, 1)
  @Meta(Require, true)
  name: string;

  /** Whether the workflow is active */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  active: boolean;

  /** The workflow nodes */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_WORKFLOW}.node`)
  nodes: AppWorkflowNodeSchema[];
}

@Meta(SchemaKind, [SCHEMA_KIND_APP_WORKFLOW_NODE, SCHEMA_KIND_ORDER_APP_WORKFLOW_NODE])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_WORKFLOW}.node`)
@Meta(Append, [Display, Description])
@Meta(Attach, SCHEMA_KIND_APP_WORKFLOW_NODE)
class AppWorkflowNodeSchemaMata implements AppWorkflowNodeSchema {  
  /** The workflow node name */
  @Meta(SchemaType, NS_SYSTEM_STRING)
  @Meta(UpLimitString, ENTITY_PRIMARY_KEY_MAX_LEN)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  name: string;

  /** The workflow node type */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
  type: string;

  /** The workflow node payload */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_KIND)
  payload: string;

  /** The workflow node arguments */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_FUNC}.callarg>`)
  args?: CallArg[];

  /** The workflow node previous nodes */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
  previous?: string[];

  /** The workflow node state */
  @Meta(SchemaType, NS_SYSTEM_OBJECT)
  state?: unknown;

  /** Fork the workflow node for multiple instances */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  fork?: boolean;

  /** The fork key paths in the payload */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
  forkKey?: string[];

  /** Whether the workflow node is un cancelable */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  unCancelable?: boolean;

  /** Whether the previous fork branches should be canceled */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  cancelPre?: boolean;

  /** Whether the payload node data should be saved */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  savePayload?: boolean;
}