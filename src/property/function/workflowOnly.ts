import { Alias, Meta, ForSchema, OfNodeKind, SchemaType, Property, PropertyValueType, InVisible, Static, ReadOnly } from "schema-node-core";

import { NODE_KIND_PROPERTY, SCHEMA_KIND_NODE_FUNCTION, NS_SYSTEM_SCHEMA_PRO_FUNC, NS_SYSTEM_BOOL } from "schema-node-core";

@Meta(Alias, 'workflowOnly')
@Meta(ForSchema, [SCHEMA_KIND_NODE_FUNCTION])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_FUNC}.workflowOnly`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
@Meta(Static, true)
@Meta(ReadOnly, true)
@Meta(InVisible, true)
export class WorkflowOnly extends Property<boolean> {}