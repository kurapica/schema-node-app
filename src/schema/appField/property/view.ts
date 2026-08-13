import { buildFuncCall, Call, Cascade, Default, DisplayOnly, EntrySource, ForSchema, InVisible, Meta, OfSchema, Property, PropertyValueType, Relation, SchemaType, Static, Valid } from "schema-node-core";

import { NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_TYPE, NODE_SELF, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_STRING } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP_FIELD } from "../../../utils/constant";

export interface FieldView {
    app: string;
    field: string;
    map: string;
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.view`)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.view`)
@Meta(Static, true)
@Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@enableStorage'))
@Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@app'), "view.owner")
export class View extends Property<FieldView> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.view`)
class FieldViewMeta implements FieldView {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    owner?: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
    app: string;

    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappforeignfields`, "@app", "@owner"))
    field: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    @Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfieldtype`, "@app", "@field"))
    fieldType?: string;

    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.gettypeentries`, "@fieldType"))
    @Meta(Cascade, 1)
    @Meta(Valid, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.isschemakindaccess`, "@fieldType", NODE_SELF, false, SCHEMA_KIND_STRING))
    map: string;
}
