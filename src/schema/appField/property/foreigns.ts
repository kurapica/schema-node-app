import { AccessEntryConsumer, BlackList, buildFuncCall, Call, Cascade, EntrySource, ForSchema, Meta, OfSchema, PrimaryIndex, Property, PropertyValueType, Relation, Require, SchemaType, Static, Visible } from "schema-node-core";

import { NODE_SELF, NS_SYSTEM_COLLECTION, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, SCHEMA_KIND_BOOL, SCHEMA_KIND_DATE, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_ENUM, SCHEMA_KIND_INT, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_STRING } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, SCHEMA_KIND_APP_FIELD } from "../../../utils/constant";

/** The foreign key info */
export interface Foreign {
  app: string;
  field: string;
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.foreigns`)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreigns`)
@Meta(Static, true)
@Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@enableStorage'))
@Relation(BlackList, Call, buildFuncCall(`${NS_SYSTEM_COLLECTION}.newarray`, '@app'))
export class Foreigns extends Property<Foreign[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreign`)
class ForeignMeta implements Foreign {
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  app: string;

  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(AccessEntryConsumer, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, false, SCHEMA_KIND_ENUM, SCHEMA_KIND_STRING, SCHEMA_KIND_INT, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_DATE, SCHEMA_KIND_BOOL))
  @Meta(Cascade, 1)
  @Meta(Require, true)
  field: string;
}
