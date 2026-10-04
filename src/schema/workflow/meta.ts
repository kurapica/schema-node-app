import { Attach, Base, buildFuncCall, Meta, NodeKind, OfNodeKind, Require, RuntimeNodeType, SchemaKind, SchemaType, Valid } from "schema-node-core";
import { WorkflowType } from "./runtime";

import type { FuncArg } from "schema-node-core";
import type { WorkflowSchema } from "./type";

import { NODE_SELF, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_KIND_STRING } from "schema-node-core";
import { SCHEMA_KIND_NODE_WORKFLOW, SCHEMA_KIND_ORDER_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW, NODE_KIND_WORKFLOW } from "../../utils/constant";

@Meta(SchemaKind, [SCHEMA_KIND_NODE_WORKFLOW, SCHEMA_KIND_ORDER_WORKFLOW])
@Meta(NodeKind, [NODE_KIND_WORKFLOW, SCHEMA_KIND_ORDER_WORKFLOW])
@Meta(RuntimeNodeType, WorkflowType)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.schema`)
@Meta(Attach, SCHEMA_KIND_NODE_WORKFLOW)
class WorkflowSchemaMeta implements WorkflowSchema {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.kind`)
    @Meta(Require, true)
    kind: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    payload?: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    settings?: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    session?: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.args`)
    args?: FuncArg[];
}

@Meta(OfNodeKind, NODE_KIND_STRING)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
@Meta(Base, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
@Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_SELF, false, NODE_KIND_WORKFLOW))
class WorkflowTypeMeta {}
