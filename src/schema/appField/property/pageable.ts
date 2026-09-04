import { Meta, ForSchema, OfSchema, SchemaType, Property, buildFuncCall, Call, Relation, Visible, InVisible, PropertyValueType } from "schema-node-core";

import { SCHEMA_KIND_PROPERTY, SCHEMA_KIND_ARRAY, NS_SYSTEM_LOGIC, NS_SYSTEM_BOOL, NS_SYSTEM_SCHEMA_REFLECT_ARRAY } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP } from "../../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.pageable`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
@Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_ARRAY}.isarrayele`, '@type', false, SCHEMA_KIND_ARRAY))
@Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.not`, '@enableStorage'))
export class Pageable extends Property<boolean> {}
