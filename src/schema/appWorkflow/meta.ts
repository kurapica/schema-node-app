import { AccessEntryConsumer, AccessValueTypeProvider, Append, ARRAY_ELEMENT, ARRAY_PREVIOUS, Assign, Attach, BlackList, buildFuncCall, Call, CascadeDepth, DataNodeType, Default, Description, Display, DisplayOnly, EntrySource, EntrySourceProvider, InVisible, KindProvider, Meta, NODE_KIND_BOOL, NODE_KIND_DATE, NODE_KIND_DECIMAL, NODE_KIND_ENUM, NODE_KIND_INT, NODE_KIND_STRING, NODE_SELF, NS_SYSTEM_INTRINSIC, NS_SYSTEM_SCHEMA_FUNC_CALL_ARG, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_TYPE, OverrideType, PrimaryIndex, ReadOnly, Relation, Require, SCHEMA_KIND_NODE_FUNC_ARG, SchemaKind, SchemaType, UpLimitString, ValueType, Visible } from "schema-node-core";

import type { CallArg } from "schema-node-core";
import type { AppWorkflowSchema, AppWorkflowNodeSchema } from "./type";

import { ENTITY_PRIMARY_KEY_MAX_LEN, NS_SYSTEM_BOOL, NS_SYSTEM_LIST, NS_SYSTEM_LOGIC, NS_SYSTEM_OBJECT, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NS_SYSTEM_STRING, NODE_KIND_ARRAY } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_WORKFLOW, NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_APP_WORKFLOW_NODE, SCHEMA_KIND_ORDER_APP_WORKFLOW, SCHEMA_KIND_ORDER_APP_WORKFLOW_NODE } from "../../utils/constant";
import { WorkflowNode } from "./node/workflowNode";
import { WorkflowArgsNode } from "./node/workflowArgsNode";
import { AppProvider } from "../../property/common/appProvider";

@Meta(SchemaKind, [SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_ORDER_APP_WORKFLOW])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_WORKFLOW}.schema`)
@Meta(Append, [Display, Description])
@Meta(Attach, SCHEMA_KIND_APP_WORKFLOW)
@Meta(EntrySourceProvider, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.getaccessentries`, `@nodes.${ARRAY_PREVIOUS}`, `@nodes.${ARRAY_ELEMENT}.previous`, NODE_SELF))
@Meta(AccessValueTypeProvider, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.getaccessvaluetype`, `@nodes.${ARRAY_PREVIOUS}`, NODE_SELF))
@Meta(KindProvider, SCHEMA_KIND_NODE_FUNC_ARG)
@Meta(AppProvider, "app")
@Relation(EntrySource, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.getaccessentries`, `@nodes.${ARRAY_PREVIOUS}`), `nodes.${ARRAY_ELEMENT}.previous.${ARRAY_ELEMENT}`)
class AppWorkflowSchemaMata implements AppWorkflowSchema {
  /** The application name */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  @Meta(ReadOnly, true)
  @Meta(InVisible, true)
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
@Meta(DataNodeType, WorkflowNode)
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
  @Meta(DisplayOnly, true)
  @Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.getpayloadtype`, `@type`))
  payload: string;

  /** The workflow node arguments */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_FUNC_CALL_ARG}>`)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.hasargs`, `@type`))
  @Meta(DataNodeType, WorkflowArgsNode)
  args?: CallArg[];

  /** The workflow node previous nodes */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
  @Relation(CascadeDepth, Assign, 1, `previous.${ARRAY_ELEMENT}`)
  @Relation(BlackList, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, `@previous.${ARRAY_PREVIOUS}`), `previous.${ARRAY_ELEMENT}`)
  previous?: string[];

  /** The workflow node state */
  @Meta(SchemaType, NS_SYSTEM_OBJECT)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.hasstate`, `@type`))
  @Relation(OverrideType, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.getstate`, `@type`))
  state?: unknown;

  /** Fork the workflow node for multiple instances */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.isforkable`, `@type`))
  fork?: boolean;

  /** The fork key paths in the payload */
  @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
  @Relation(AccessEntryConsumer, Assign, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_SELF, false, NODE_KIND_ENUM, NODE_KIND_STRING, NODE_KIND_INT, NODE_KIND_DECIMAL, NODE_KIND_DATE, NODE_KIND_BOOL), `forkKey.${ARRAY_ELEMENT}`)
  @Relation(AccessValueTypeProvider, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.getaccessvaluetype`, `@payload`, NODE_SELF), `forkKey.${ARRAY_ELEMENT}`)
  @Relation(EntrySource, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.getaccessentries`, '@payload', NODE_SELF), `forkKey.${ARRAY_ELEMENT}`)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.isforkable`, `@type`))
  @Relation(InVisible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, '@payload', false, NODE_KIND_ARRAY))
  forkKey?: string[];

  /** Whether the workflow node is un cancelable */
  @Meta(SchemaType, NS_SYSTEM_BOOL)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.not`, `@fork`))
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
