import { Meta, ForSchema, OfSchema, SchemaType, Property, PropertyValueType } from "schema-node-core";

import { SCHEMA_KIND_PROPERTY, NS_SYSTEM_BOOL } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP } from "../../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.enableStorage`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
export class EnableStorage extends Property<boolean> {}
