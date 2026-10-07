import { Alias, Meta, ForSchema, OfNodeKind, SchemaType, Property, PropertyValueType, Relation, Visible, Call, buildFuncCall, Assign, CascadeDepth, EntrySource, ARRAY_ELEMENT } from "schema-node-core";

import { NODE_KIND_PROPERTY, NS_SYSTEM_LIST, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NS_SYSTEM_SCHEMA_REFLECT_GET_ACCESS_ENTRIES, NODE_KIND_STRUCT } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, NS_SYSTEM_SCHEMA_APP } from "../../../utils/constant";

export interface ColPolicy {
    name: string;
    evaluators: string[];
}

@Meta(Alias, 'colAuths')
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.colAuths`)
@Meta(PropertyValueType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_PRO_APP}.policy.col>`)
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, '@type', true, NODE_KIND_STRUCT))
@Relation(EntrySource, Assign, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_GET_ACCESS_ENTRIES, '@type'), `colAuths.${ARRAY_ELEMENT}.name`)
export class ColAuths extends Property<ColPolicy[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.policy.col`)
class ColPolicyMeta implements ColPolicy {
    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(CascadeDepth, 1)
    name: string;

    @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_APP}.policy.evaluator>`)
    evaluators: string[];
}
