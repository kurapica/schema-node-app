import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, NS_SYSTEM_INT, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_LIST, PropertyValueType } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_APP } from "../../utils/constant";

export interface ColPolicy {
    name: string;
    evaluators: string[];
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.colAuths`)
@Meta(PropertyValueType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_PROPERTY_APP}.policy.col>`)
export class ColAuths extends Property<ColPolicy[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.policy.col`)
class ColPolicyMeta implements ColPolicy {
    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    name: string;

    @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_APP}.policy.evaluator>`)
    evaluators: string[];
}