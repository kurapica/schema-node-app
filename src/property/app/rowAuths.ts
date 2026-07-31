import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_LIST, PropertyValueType } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_APP } from "../../utils/constant";

export interface RowPolicy {
    evaluator: string;
    filter: string;
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.rowAuths`)
@Meta(PropertyValueType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_APP}.policy.row>`)
export class RowAuths extends Property<RowPolicy[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.row`)
class RowPolicyMeta implements RowPolicy {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.evaluator`)
    evaluator: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.valid`)
    filter: string;
}