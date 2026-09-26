import { SchemaKind, Append, Attach, Meta, SchemaType, PrimaryIndex, Require, ReadOnly, InVisible, Immutable, Relation, Default, Call, buildFuncCall, TypeProvider, EntrySourceProvider, AccessValueTypeProvider, NODE_SELF, Description, Disable, Display, NS_SYSTEM_SCHEMA_REFLECT_ARRAY } from "schema-node-core";

import type { AppFieldSchema } from "./type";

import { NS_SYSTEM_IDENTIFIER, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_TYPE } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_ORDER_APP_FIELD } from "../../utils/constant";

/** The meta of the app field schema */
@Meta(SchemaKind, [SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_ORDER_APP_FIELD])
@Meta(Append, [Display, Description, Disable])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.schema`)
@Meta(Attach, SCHEMA_KIND_APP_FIELD)
@Meta(TypeProvider, 'type')
@Meta(EntrySourceProvider, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_ARRAY}.getelementaccessentries`, "@type", NODE_SELF))
@Meta(AccessValueTypeProvider, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_ARRAY}.getelementaccessvaluetype`, "@type", NODE_SELF))
class AppFieldSchemaMeta implements AppFieldSchema {
  /** The application name */
  @Meta(PrimaryIndex, 0)
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(Require, true)
  @Meta(ReadOnly, true)
  @Meta(InVisible, true)
  app: string;

  /** The name of the field */
  @Meta(PrimaryIndex, 1)
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(Require, true)
  @Meta(Immutable, true)
  @Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.gettypename`, '@type'))
  name: string;

  /** The type of the field */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  @Meta(Require, true)
  type: string;
}
