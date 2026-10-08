import { Alias, Meta, ForSchema, OfNodeKind, SchemaType, Property, PropertyValueType, InVisible, Static, DisplayOnly } from "schema-node-core";

import { NODE_KIND_PROPERTY, SCHEMA_KIND_NODE, NS_SYSTEM_BOOL } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, SCHEMA_KIND_APP_WORKFLOW, SCHEMA_KIND_APP } from "../../utils/constant";

/** Allow update the schema */
@Meta(Alias, 'schemaUpdate')
@Meta(ForSchema, [SCHEMA_KIND_NODE, SCHEMA_KIND_APP, SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_APP_WORKFLOW])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.SchemaUpdate`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
@Meta(Static, true)
@Meta(InVisible, true)
@Meta(DisplayOnly, true)
export class SchemaUpdate extends Property<boolean> {}
