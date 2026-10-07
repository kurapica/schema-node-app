import { AccessEntryConsumer, Alias, BlackList, buildFuncCall, Call, CascadeDepth, ForSchema, InVisible, Meta, NS_SYSTEM_LOGIC, OfNodeKind, PrimaryIndex, Property, PropertyValueType, Relation, Require, SchemaType, Static, Visible } from "schema-node-core";

import { NODE_SELF, NS_SYSTEM_COLLECTION, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND,NODE_KIND_PROPERTY, NODE_KIND_STRING } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, SCHEMA_KIND_APP_FIELD } from "../../../utils/constant";

/** The foreign key info */
export interface Foreign {
  app: string;
  field: string;
}

@Meta(Alias, 'foreigns')
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.foreigns`)
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreigns`)
@Meta(Static, true)
@Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.not`, '@enableStorage'))
@Relation(BlackList, Call, buildFuncCall(`${NS_SYSTEM_COLLECTION}.newarray`, '@app'))
export class Foreigns extends Property<Foreign[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreign`)
class ForeignMeta implements Foreign {
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  app: string;

  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(AccessEntryConsumer, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NODE_SELF, false, NODE_KIND_STRING))
  @Meta(CascadeDepth, 1)
  @Meta(Require, true)
  field: string;
}
