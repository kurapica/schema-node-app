import { Assign, buildFuncCall, Call, CascadeDepth, Default, DisplayOnly, EntrySource, ForSchema, InVisible, Meta, NS_SYSTEM_LOGIC_EQ, OfNodeKind, Property, PropertyValueType, Relation, SchemaType, Static, Valid } from "schema-node-core";

import { NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_TYPE, NODE_SELF, NODE_KIND_PROPERTY, NODE_KIND_STRING } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP_FIELD } from "../../../utils/constant";
import { AppScopeType } from "../../../enum";

export interface FieldView {
    app: string;
    field: string;
    map?: string;
}

/** The field view from other app */
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.view`)
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.view`)
@Meta(Static, true)
@Relation(InVisible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@enableStorage', true))
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
    @Relation(EntrySource, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappforeignfields`, "@app", "@owner"), 'field')
    field: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    @Meta(DisplayOnly, true)
    @Meta(InVisible, true)
    @Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfieldtype`, "@app", "@field", true))
    fieldType?: string;

    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    @Meta(CascadeDepth, 1)
    @Relation(EntrySource, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.gettypeentries`, "@fieldType"), 'map')
    @Relation(Valid, Assign,  buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.isnodekindaccess`, "@fieldType", NODE_SELF, false, NODE_KIND_STRING), 'map')
    @Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.isscopepolicy`, '@app', AppScopeType.SystemLevel))
    map?: string;
}
