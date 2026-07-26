import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_FUNCTION, NS_SYSTEM_SCHEMA_PROPERTY_FUNC } from "schema-node-core";

@Meta(ForSchema, [SCHEMA_KIND_FUNCTION])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_FUNC}.workflowOnly`)
export class WorkflowOnly extends Property<boolean> {}