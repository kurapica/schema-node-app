import { Meta, ForSchema, OfSchema, SchemaType, Property, PropertyValueType, Relation, Visible, Call, buildFuncCall, InVisible } from "schema-node-core";
import { FieldStorageTopology } from "../../../enum/fieldStorageTopology";

import { SCHEMA_KIND_PROPERTY, NS_SYSTEM_LOGIC, NS_SYSTEM_SCHEMA_REFLECT_STRUCT } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, NS_SYSTEM_SCHEMA_APP_FIELD } from "../../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.topology`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.topology`)
@Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.not`, '@enableStorage'))
@Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_STRUCT}.hasdynamicfield`, '@type'))
export class Topology extends Property<FieldStorageTopology> {}
