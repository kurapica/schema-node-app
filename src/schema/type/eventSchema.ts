import { FuncArg, Meta, NodeSchemaKind, SchemaKind, SchemaType, RuntimeNodeType, Attach, Property, ForSchema, OfSchema, SCHEMA_KIND_PROPERTY, NS_SYSTEM_SCHEMA_PROPERTY_CORE, ReadOnly, PropertyValueType, Relation, Visible, Call, buildFuncCall, NS_SYSTEM_LOGIC_EQ, NODE_SELF, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, SCHEMA_KIND_STRING, Valid, Base, NS_SYSTEM_SCHEMA_FUNC } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_EVENT, SCHEMA_KIND_EVENT, SCHEMA_KIND_ORDER_EVENT } from "../../utils/constant";
import { EventType } from "../../runtime/eventType";

/** The event schema */
export interface EventSchema {
    /** The event arguments */
    args?: FuncArg[];

    /** The payload schema type */
    payload?: string;
}

/** The event schema meta */
@Meta(SchemaKind, [SCHEMA_KIND_EVENT, SCHEMA_KIND_ORDER_EVENT])
@Meta(NodeSchemaKind, SCHEMA_KIND_EVENT)
@Meta(RuntimeNodeType, EventType)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.schema`)
@Meta(Attach, SCHEMA_KIND_EVENT)
class EventSchemaMeta implements EventSchema {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.args`)
    args?: FuncArg[];
    
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    payload?: string;
}

/** The event property for node schema */
@Meta(ForSchema, [SCHEMA_KIND_EVENT])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_CORE}.event`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_EVENT}.schema`)
@Meta(ReadOnly, true) // only system event allowed
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@kind', SCHEMA_KIND_EVENT))
export class EventProperty extends Property<EventSchema> {}

@Meta(OfSchema, SCHEMA_KIND_STRING)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.type`)
@Meta(Base, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
@Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, SCHEMA_KIND_EVENT))
class EventTypeMeta {}