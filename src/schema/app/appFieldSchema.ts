import { Meta, SchemaKind, SchemaType, Attach, Append, Display, Description, Disable, PrimaryIndex, Require, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_ORDER_APP_FIELD, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_APP } from "../../utils/constant";

export interface AppFieldSchema {
  /** The application name */
  app: string;

  /** The name of the field */
  name: string;

  /** The type of the field */
  type: string;

  //#region Status

  /** The error message of the field */
  error?: string;

  //#endregion
}

/** The meta of the app field schema */
@Meta(SchemaKind, [SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_ORDER_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.schema`)
@Meta(Attach, SCHEMA_KIND_APP_FIELD)
@Meta(Append, [Display, Description, Disable])
class AppFieldSchemaMeta implements AppFieldSchema {
  /** The application name */
  @Meta(PrimaryIndex, 0)
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(Require, true)
  app: string;

  /** The name of the field */
  @Meta(PrimaryIndex, 1)
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(Require, true)
  name: string;

  /** The type of the field */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  @Meta(Require, true)
  type: string;
}