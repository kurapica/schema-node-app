import { Meta, ForSchema, OfNodeKind, SchemaType, Property, PropertyValueType, ReadOnly, Visible, Call, buildFuncCall, Relation, SCHEMA_KIND_NODE } from "schema-node-core";

import type { EventSchema } from "./type";

import { NODE_KIND_PROPERTY, NS_SYSTEM_SCHEMA_PRO, NS_SYSTEM_SCHEMA_PRO_CORE, NS_SYSTEM_LOGIC_EQ, NS_SYSTEM_SCHEMA_FUNC_TYPE } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_EVENT, SCHEMA_KIND_NODE_EVENT } from "../../utils/constant";

/** The event property for node schema */
@Meta(ForSchema, [SCHEMA_KIND_NODE])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_CORE}.event`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_EVENT}.schema`)
@Meta(ReadOnly, true) // only system event allowed
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@kind', SCHEMA_KIND_NODE_EVENT))
export class EventProperty extends Property<EventSchema> {}

/** The payload evaluator */
@Meta(ForSchema, [SCHEMA_KIND_NODE_EVENT])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO}.event.payloadEvaluator`)
@Meta(PropertyValueType, NS_SYSTEM_SCHEMA_FUNC_TYPE)
export class PayloadEvaluator extends Property<string> {};
