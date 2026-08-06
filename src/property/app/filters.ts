import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, NS_SYSTEM_IDENTIFIER, PropertyValueType, Default, NS_SYSTEM_SCHEMA_FUNC_TYPE, Relation, InVisible, Call, buildFuncCall, NS_SYSTEM_LOGIC_EQ, Visible, Cascade, AccessEntryConsumer, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, SCHEMA_KIND_ENUM, SCHEMA_KIND_STRING, SCHEMA_KIND_INT, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_DATE, SCHEMA_KIND_BOOL, Valid, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NS_SYSTEM_BOOL, PrimaryIndex, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, DisplayOnly, AccessValueTypeResolver, NS_SYSTEM_SCHEMA_REFLECT_ENUM } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_APP_FIELD } from "../../utils/constant";
import { FieldFilterMode, FieldFilterResolve } from "../../enum/fieldFilterMode";

export interface FieldFilter {
    /** The filter mode */
    mode: FieldFilterMode;
    /** The field name */
    filter: string;
    /** The filter function name */
    filterFunc?: string;
    /** The field filter resolve type, which defines how to resolve the filter when no contains found */
    resolve?: FieldFilterResolve;
}

/** The field filters property */
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.filters`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filters`)
export class Filters extends Property<FieldFilter[]> {}

/** The field filter meta */
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filter`)
class FieldFilterMeta implements FieldFilter {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filtermode`)
    @Meta(Default, FieldFilterMode.Exactly)
    mode: FieldFilterMode;

    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(PrimaryIndex, 0)
    @Meta(AccessEntryConsumer, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, false, SCHEMA_KIND_ENUM, SCHEMA_KIND_STRING, SCHEMA_KIND_INT, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_DATE, SCHEMA_KIND_BOOL))
    @Meta(Cascade, 1) // only the first level
    @Relation(InVisible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@mode', FieldFilterMode.Filter))
    filter: string;

    /** The filter function name */
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_FUNC_TYPE)
    @Meta(PrimaryIndex, 1)
    @Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NODE_SELF, NS_SYSTEM_BOOL))
    @Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@mode', FieldFilterMode.Filter))
    filterFunc?: string;

    /** The filter field type */
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    @Meta(AccessValueTypeResolver, `filter`)
    filterType?: string;

    /** The field filter resolve type, which defines how to resolve the filter when no contains found */
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filterresolve`)
    @Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_ENUM, 'hascascade', '@filterType', true))
    resolve?: FieldFilterResolve;
}