import { Meta, ForSchema, OfSchema, SchemaType, Property, PropertyValueType, Relation, Visible, Call, buildFuncCall, Assign, Cascade, EntrySource } from "schema-node-core";

import { SCHEMA_KIND_PROPERTY, NS_SYSTEM_LIST, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NS_SYSTEM_SCHEMA_REFLECT_GET_ACCESS_ENTRIES, SCHEMA_KIND_STRUCT } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_APP } from "../../../utils/constant";

export interface ColPolicy {
    name: string;
    evaluators: string[];
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.colAuths`)
@Meta(PropertyValueType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_PROPERTY_APP}.policy.col>`)
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, '@type', true, SCHEMA_KIND_STRUCT))
@Relation(EntrySource, Assign, NS_SYSTEM_SCHEMA_REFLECT_GET_ACCESS_ENTRIES, '@type')
export class ColAuths extends Property<ColPolicy[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.policy.col`)
class ColPolicyMeta implements ColPolicy {
    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(Cascade, 1)
    name: string;

    @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_APP}.policy.evaluator>`)
    evaluators: string[];
}
