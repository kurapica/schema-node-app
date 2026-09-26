import { Meta, ForSchema, OfSchema, SchemaType, Property, PropertyValueType, Relation, InVisible, Call, buildFuncCall, NS_SYSTEM_LOGIC } from "schema-node-core";

import { SCHEMA_KIND_PROPERTY, NS_SYSTEM_BOOL } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP } from "../../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.allowClear`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
@Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.not`, '@enableStorage'))
export class AllowClear extends Property<boolean> {}
