import { Meta, ForSchema, OfSchema, SchemaType, Property, PropertyValueType, Relation, buildFuncCall, Call, Visible } from "schema-node-core";

import { SCHEMA_KIND_PROPERTY, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP } from "../../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.tableName`)
@Meta(PropertyValueType, NS_SYSTEM_IDENTIFIER)
@Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@enableStorage'))
export class TableName extends Property<string> {}
