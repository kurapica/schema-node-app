import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, PropertyValueType, NS_SYSTEM_IDENTIFIER, Relation, NS_SYSTEM_INTRINSIC, buildFuncCall, Call, Visible } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP } from "../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.tableName`)
@Meta(PropertyValueType, NS_SYSTEM_IDENTIFIER)
@Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@enableStorage'))
export class TableName extends Property<string> {}