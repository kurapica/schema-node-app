import { Meta, NodeKind, SchemaKind, SchemaType, RuntimeNodeType, Attach, OfNodeKind, buildFuncCall, Valid, Base, Append, Generics, Relations, DataNodeType, FuncArgsNode, DisplayOnly, InVisible, Assign, Relation, Visible, Call, NS_SYSTEM_LIST, NS_SYSTEM_SCHEMA_FUNC_CALL_ARG, NS_SYSTEM_SCHEMA_NODE_TYPE } from "schema-node-core";
import { EventType } from "./runtime";

import type { CallArg, FuncArg } from "schema-node-core";
import type { EventSchema } from "./type";

import { NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_KIND_STRING, NS_SYSTEM_SCHEMA_FUNC, NODE_SELF } from "schema-node-core";
import { NODE_KIND_EVENT, NS_SYSTEM_SCHEMA_EVENT, NS_SYSTEM_SCHEMA_REFLECT_EVENT, SCHEMA_KIND_NODE_EVENT, SCHEMA_KIND_ORDER_EVENT } from "../../utils/constant";
import { EventDeclareNode } from "./node/eventDeclareNode";
import { EventDeclareArgsNode } from "./node/eventDeclareArgsNode";

/** The event schema meta */
@Meta(SchemaKind, [SCHEMA_KIND_NODE_EVENT, SCHEMA_KIND_ORDER_EVENT])
@Meta(NodeKind, [NODE_KIND_EVENT, SCHEMA_KIND_ORDER_EVENT])
@Meta(RuntimeNodeType, EventType)
@Meta(Append, [Generics, Relations])
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
@Meta(Base, NS_SYSTEM_SCHEMA_NODE_TYPE)
@Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_SELF, false, NODE_KIND_EVENT))
class EventTypeMeta {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.declare`)
@Meta(DataNodeType, EventDeclareNode)
class EventDeclareMeta {
    /** The expected payload type */
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, false)
    payload?: string;

    /** The event type */
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.type`)
    @Relation(Valid, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_EVENT}.withpayload`, '@payload'))
    event: string;

    /** The event arguments */
    @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_FUNC_CALL_ARG}>`)
    @Meta(DataNodeType, EventDeclareArgsNode)
    @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_EVENT}.hasargs`, '@event'))
    args?: CallArg[];
}