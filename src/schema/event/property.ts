import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, NS_SYSTEM_SCHEMA_PROPERTY, NS_SYSTEM_SCHEMA_PROPERTY_CORE, PropertyValueType, ReadOnly, Visible, Call, buildFuncCall, NS_SYSTEM_LOGIC_EQ, Relation } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_EVENT, SCHEMA_KIND_EVENT } from "../../utils/constant";
import { type EventSchema } from "./type";

/** The event property for node schema */
@Meta(ForSchema, [SCHEMA_KIND_EVENT])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_CORE}.event`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_EVENT}.schema`)
@Meta(ReadOnly, true) // only system event allowed
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@kind', SCHEMA_KIND_EVENT))
export class EventProperty extends Property<EventSchema> {}

/** The payload evaluator */
@Meta(ForSchema, [SCHEMA_KIND_EVENT])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY}.event.payloadEvaluator`)
export class PayloadEvaluator extends Property<string> {};
