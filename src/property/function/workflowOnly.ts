import { Meta, ForSchema, OfSchema, SchemaType, Property, PropertyValueType } from "schema-node-core";

import { SCHEMA_KIND_PROPERTY, SCHEMA_KIND_FUNCTION, NS_SYSTEM_SCHEMA_PROPERTY_FUNC, NS_SYSTEM_BOOL } from "schema-node-core";

@Meta(ForSchema, [SCHEMA_KIND_FUNCTION])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_FUNC}.workflowOnly`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
export class WorkflowOnly extends Property<boolean> {}