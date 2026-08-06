import { buildFuncCall, Call, EntrySource, ForSchema, Meta, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, OfSchema, Property, PropertyValueType, Relation, SCHEMA_KIND_PROPERTY, SchemaType, InVisible, Static, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, DisplayOnly, Default, Cascade, NODE_SELF, NS_SYSTEM_SCHEMA_REFLECT_TYPE, SCHEMA_KIND_STRING, Valid } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP_FIELD } from "../../utils/constant";

/** The view settings property */
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.view`)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.view`)
@Meta(Static, true)
@Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@enableStorage'))
@Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@app'), "view.owner")
export class View extends Property<FieldView> {}

/** The view settings */
export interface FieldView {
    /** The source application */
    app: string;

    /** The source field */
    field: string;

    /** The target map field */
    map: string;
}

/** The view settings meta */
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.view`)
class FieldViewMeta implements FieldView {
    /** The owner application */
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    owner?: string;

    /** The source application */
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    app: string;

    /** The source field */
    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappforeignfields`, "@app", "@owner"))
    field: string;

    /** The source field type */
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    @Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfieldtype`, "@app", "@field"))
    fieldType?: string;

    /** The target map field */
    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.gettypeentries`, "@fieldType"))
    @Meta(Cascade, 1)
    @Meta(Valid, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.isschemakindaccess`, "@fieldType", NODE_SELF, false, SCHEMA_KIND_STRING))
    map: string;
}