import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP } from "../../utils/constant";

export interface RowPolicy {
    evaluator: string;
    filter: string;
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.rowAuths`)
export class RowAuths extends Property<RowPolicy[]> {}