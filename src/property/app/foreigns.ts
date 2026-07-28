import { buildFuncCall, Call, EntrySource, ForSchema, Meta, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, OfSchema, PrimaryIndex, Property, PropertyValueType, Relation, Require, SCHEMA_KIND_PROPERTY, SchemaType, Static, Visible } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP_FIELD } from "../../utils/constant";

/** The foreign field property */
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.foreigns`)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreigns`)
@Meta(Static, true)
@Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@enableStorage'))
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
  @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfields`, "@{app}"))
  field: string;
}