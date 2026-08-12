import { AccessEntryConsumer, Append, Attach, buildFuncCall, Call, type CallArg, Description, Display, ENTITY_PRIMARY_KEY_MAX_LEN, EntrySource, InVisible, Meta, NODE_SELF, NS_SYSTEM_BOOL, NS_SYSTEM_INTRINSIC, NS_SYSTEM_LIST, NS_SYSTEM_LOGIC, NS_SYSTEM_OBJECT, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_SCHEMA_NODE_VALUE_KIND, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NS_SYSTEM_SCHEMA_REFLECT_TYPE, NS_SYSTEM_STRING, PrimaryIndex, Relation, Require, SCHEMA_KIND_ARRAY, SCHEMA_KIND_BOOL, SCHEMA_KIND_DATE, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_ENUM, SCHEMA_KIND_INT, SCHEMA_KIND_STRING, SchemaKind, SchemaType, UpLimitString, ValueType, Visible } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW_NODE, SCHEMA_KIND_ORDER_APP_WORKFLOW, SCHEMA_KIND_ORDER_APP_WORKFLOW_NODE } from "../../utils/constant";
import type { AppWorkflowSchema, AppWorkflowNodeSchema } from "./type";

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
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_KIND)
  @Meta(Require, true)
  @Meta(AccessEntryConsumer, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, false, SCHEMA_KIND_STRING, SCHEMA_KIND_INT, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_BOOL, SCHEMA_KIND_DATE, SCHEMA_KIND_ENUM, SCHEMA_KIND_ARRAY))
  type: string;

  /** The workflow node payload */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_KIND)
  payload: string;

  /** The workflow node arguments */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.args`)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@type`))
  @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.gettypeentries`, `@type`))
  args?: CallArg[];

  /** The workflow node previous nodes */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
  previous?: string[];

  /** The workflow node state */
  @Meta(SchemaType, NS_SYSTEM_OBJECT)
  @Meta(InVisible, true)
  state?: unknown;

  /** Fork the workflow node for multiple instances */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@type`, true, NS_SYSTEM_OBJECT))
  fork?: boolean;

  /** The fork key paths in the payload */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.and`, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@type`, true, NS_SYSTEM_OBJECT), buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@fork`, true)))
  forkKey?: string[];

  /** Whether the workflow node is un cancelable */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  unCancelable?: boolean;

  /** Whether the previous fork branches should be canceled */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.and`, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@type`, true, NS_SYSTEM_OBJECT), buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@fork`, true)))
  cancelPre?: boolean;

  /** Whether the payload node data should be saved */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  savePayload?: boolean;

  /** The error message */
  @Meta(SchemaType, NS_SYSTEM_STRING)
  @Meta(InVisible, true)
  error?: string;

  /** The payload value type */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_KIND)
  @Meta(InVisible, true)
  payloadValueType?: ValueType;
}
