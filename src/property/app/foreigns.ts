import { AccessEntryConsumer, BlackList, buildFuncCall, Call, Cascade, EntrySource, ForSchema, Meta, NODE_SELF, NS_SYSTEM_COLLECTION, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, OfSchema, PrimaryIndex, Property, PropertyValueType, Relation, Require, SCHEMA_KIND_BOOL, SCHEMA_KIND_DATE, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_ENUM, SCHEMA_KIND_INT, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_STRING, SchemaType, Static, Visible } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP_FIELD } from "../../utils/constant";

/** The foreign field property */
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.foreigns`)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreigns`)
@Meta(Static, true)
@Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@enableStorage'))
@Relation(BlackList, Call, buildFuncCall(`${NS_SYSTEM_COLLECTION}.newarray`, '@app'))
export class Foreigns extends Property<Foreign[]>{};

/** The foreign field setting */
export interface Foreign {
  /** The foreign app name. */
  app: string;

  /** The field refer to the other app target */
  field: string;
}

/** The foreign field meta */
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreign`)
export class ForeignMeta implements Foreign {
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  app: string;

  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(AccessEntryConsumer, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, false, SCHEMA_KIND_ENUM, SCHEMA_KIND_STRING, SCHEMA_KIND_INT, SCHEMA_KIND_DECIMAL, SCHEMA_KIND_DATE, SCHEMA_KIND_BOOL))
  @Meta(Cascade, 1) // only the first level
  @Meta(Require, true)
  field: string;
}