import { Meta, NodeKind, SchemaKind, SchemaType, RuntimeNodeType, Attach, OfNodeKind, buildFuncCall, Valid, Base } from "schema-node-core";
import { EventType } from "./runtime";

import type { FuncArg } from "schema-node-core";
import type { EventSchema } from "./type";

import { NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_KIND_STRING, NS_SYSTEM_SCHEMA_FUNC, NODE_SELF } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_EVENT, SCHEMA_KIND_NODE_EVENT, SCHEMA_KIND_ORDER_EVENT } from "../../utils/constant";

/** The event schema meta */
@Meta(SchemaKind, [SCHEMA_KIND_NODE_EVENT, SCHEMA_KIND_ORDER_EVENT])
@Meta(NodeKind, [SCHEMA_KIND_NODE_EVENT, SCHEMA_KIND_ORDER_EVENT])
@Meta(RuntimeNodeType, EventType)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.schema`)
@Meta(Attach, SCHEMA_KIND_NODE_EVENT)
class EventSchemaMeta implements EventSchema {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.args`)
    args?: FuncArg[];
    
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    payload?: string;
}

@Meta(OfNodeKind, NODE_KIND_STRING)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.type`)
@Meta(Base, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
@Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_SELF, false, SCHEMA_KIND_NODE_EVENT))
class EventTypeMeta {}
