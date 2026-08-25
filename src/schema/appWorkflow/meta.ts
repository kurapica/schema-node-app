import { Append, Attach, buildFuncCall, Call, Description, Display, InVisible, Meta, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, PrimaryIndex, Relation, Require, SchemaKind, SchemaType, UpLimitString, ValueType, Visible } from "schema-node-core";

import type { CallArg } from "schema-node-core";
import type { AppWorkflowSchema, AppWorkflowNodeSchema } from "./type";

import { ENTITY_PRIMARY_KEY_MAX_LEN, NS_SYSTEM_BOOL, NS_SYSTEM_INTRINSIC, NS_SYSTEM_LIST, NS_SYSTEM_LOGIC, NS_SYSTEM_OBJECT, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NS_SYSTEM_STRING, SCHEMA_KIND_ARRAY } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_WORKFLOW, NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW_NODE, SCHEMA_KIND_ORDER_APP_WORKFLOW, SCHEMA_KIND_ORDER_APP_WORKFLOW_NODE } from "../../utils/constant";

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
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_WORKFLOW}.nodes`)
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
  @Meta(Require, true)
  type: string;

  /** The workflow node payload */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  payload: string;

  /** The workflow node arguments */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.args`)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.hasargs`, `@type`))
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
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.isforkable`, `@type`))
  fork?: boolean;

  /** The fork key paths in the payload */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.isforkable`, `@type`))
  @Relation(InVisible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, '@payload', false, SCHEMA_KIND_ARRAY))
  forkKey?: string[];

  /** Whether the workflow node is un cancelable */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@fork`))
  unCancelable?: boolean;

  /** Whether the previous fork branches should be canceled */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.notempty`, '@forkKey'))
  cancelPre?: boolean;

  /** Whether the payload node data should be saved */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.notempty`, `@payload`))
  savePayload?: boolean;

  /** The error message */
  @Meta(SchemaType, NS_SYSTEM_STRING)
  @Meta(InVisible, true)
  error?: string;

  /** The payload value type */
  payloadValueType?: ValueType;
}
