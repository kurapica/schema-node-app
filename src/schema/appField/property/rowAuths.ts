import { Alias, Meta, ForSchema, OfNodeKind, SchemaType, Property, PropertyValueType, Relation, Valid, Assign, buildFuncCall, ARRAY_ELEMENT, Visible, Call, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_KIND_STRUCT, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, DisplayOnly, InVisible, Default, NS_SYSTEM_SCHEMA_REFLECT_ARRAY } from "schema-node-core";

import { NODE_KIND_PROPERTY, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_LIST, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NODE_SELF } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, NS_SYSTEM_SCHEMA_APP } from "../../../utils/constant";

export interface RowPolicy {
    evaluator: string;
    filter: string;
}

@Meta(Alias, 'rowAuths')
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.rowAuths`)
@Meta(PropertyValueType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_APP}.policy.row>`)
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, '@type', true, NODE_KIND_STRUCT))
@Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_ARRAY}.getarrayelement`, '@type'), `rowAuths.${ARRAY_ELEMENT}.fieldType`)
export class RowAuths extends Property<RowPolicy[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.row`)
class RowPolicyMeta implements RowPolicy {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.evaluator`)
    evaluator: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.valid`)
    @Relation(Valid, Assign, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NODE_SELF, '@fieldType'))
    filter: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    fieldType?: string;
}
