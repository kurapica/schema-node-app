import { AccessEntryConsumer, AccessValueTypeResolver, buildFuncCall, Call, CascadeDepth, Default, DisplayOnly, ForSchema, InVisible, Meta, OfSchema, PrimaryIndex, Property, PropertyValueType, Relation, SchemaType, Valid, Visible } from "schema-node-core";
import { FieldFilterMode, FieldFilterResolve } from "../../../enum/fieldFilterMode";

import { NODE_SELF, NS_SYSTEM_BOOL, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_LOGIC_EQ, NS_SYSTEM_SCHEMA_FUNC_TYPE, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_ENUM, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, SCHEMA_KIND_BOOL, SCHEMA_KIND_DATE, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_ENUM, SCHEMA_KIND_INT, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_STRING } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, NS_SYSTEM_SCHEMA_APP_FIELD } from "../../../utils/constant";

export interface FieldFilter {
    mode: FieldFilterMode;
    filter: string;
    filterFunc?: string;
    resolve?: FieldFilterResolve;
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.filters`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filters`)
export class Filters extends Property<FieldFilter[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filter`)
class FieldFilterMeta implements FieldFilter {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filtermode`)
    @Meta(Default, FieldFilterMode.Exactly)
    mode: FieldFilterMode;

    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(PrimaryIndex, 0)
    @Meta(AccessEntryConsumer, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, false, SCHEMA_KIND_ENUM, SCHEMA_KIND_STRING, SCHEMA_KIND_INT, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_DATE, SCHEMA_KIND_BOOL))
    @Meta(CascadeDepth, 1)
    @Relation(InVisible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@mode', FieldFilterMode.Filter))
    filter: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_FUNC_TYPE)
    @Meta(PrimaryIndex, 1)
    @Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NODE_SELF, NS_SYSTEM_BOOL))
    @Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@mode', FieldFilterMode.Filter))
    filterFunc?: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    @Meta(AccessValueTypeResolver, `filter`)
    filterType?: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filterresolve`)
    @Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_ENUM, 'hascascade', '@filterType', true))
    resolve?: FieldFilterResolve;
}
