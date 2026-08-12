import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_NODE, NS_SYSTEM_BOOL, PropertyValueType } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_APP } from "../../utils/constant";

/** Allow delete the schema */
@Meta(ForSchema, [SCHEMA_KIND_NODE, SCHEMA_KIND_APP, SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_APP_WORKFLOW])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.SchemaDelete`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
export class SchemaDelete extends Property<boolean> {}
