import { Meta, NodeSchemaKind, SchemaKind, SchemaType, RuntimeNodeType, Attach, OfSchema, buildFuncCall, Valid, Base } from "schema-node-core";
import { EventType } from "./runtime";

import type { FuncArg } from "schema-node-core";
import type { EventSchema } from "./type";

import { NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, SCHEMA_KIND_STRING, NS_SYSTEM_SCHEMA_FUNC, NODE_SELF } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_EVENT, SCHEMA_KIND_EVENT, SCHEMA_KIND_ORDER_EVENT } from "../../utils/constant";

/** The event schema meta */
@Meta(SchemaKind, [SCHEMA_KIND_EVENT, SCHEMA_KIND_ORDER_EVENT])
@Meta(NodeSchemaKind, [SCHEMA_KIND_EVENT, SCHEMA_KIND_ORDER_EVENT])
@Meta(RuntimeNodeType, EventType)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.schema`)
@Meta(Attach, SCHEMA_KIND_EVENT)
class EventSchemaMeta implements EventSchema {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.args`)
    args?: FuncArg[];
    
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    payload?: string;
}

@Meta(OfSchema, SCHEMA_KIND_STRING)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.type`)
@Meta(Base, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
@Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, false, SCHEMA_KIND_EVENT))
class EventTypeMeta {}
