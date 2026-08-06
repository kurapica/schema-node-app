import { AccessValueTypeProvider, Append, Attach, Base, buildFuncCall, Description, Display, ENTRY_ROOT, EntrySource, EntrySourceProvider, Meta, NODE_SELF, NodeSchema, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_SCHEMA_REFLECT, NS_SYSTEM_STRING, OfSchema, PRIMARY_KEY_MAX_LEN, PrimaryIndex, Relations, SCHEMA_KIND_STRING, SchemaKind, SchemaLoadState, SchemaType, UpLimitString } from "schema-node-core";
import { AppFieldSchema } from "./appFieldSchema";
import { AppWorkflowSchema } from "./appWorkflowSchema";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP, SCHEMA_KIND_ORDER_APP } from "../../utils/constant";

export interface AppSchema {
  /** The container for the app */
  container?: string;

  /** The name of the app */
  name: string;

  //#region Runtime status

  /** Whether the app is a container app */
  hasApps?: boolean;

  /** Whether the app has fields */
  hasFields?: boolean;

  /** The sub-apps of the app */
  apps?: AppSchema[];

  /** The fields of the app */
  fields?: AppFieldSchema[];

  /** The workflows of the app */
  workflows?: AppWorkflowSchema[];

  /** The node schemas of the app */
  nodeSchemas?: NodeSchema[];

  /** The error message */
  error?: string;

  /** The load state of the app */
  loadState?: SchemaLoadState;

  //#endregion
}

/** Declare the application schema kind */
@Meta(SchemaKind, [SCHEMA_KIND_APP, SCHEMA_KIND_ORDER_APP])
@Meta(Append, [Display, Description, Relations])
class AppKind {}

/** The application schema metadata */
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.schema`)
@Meta(Attach, SCHEMA_KIND_APP)
@Meta(EntrySourceProvider, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getaccessentries`, '@container', '@name', NODE_SELF, ENTRY_ROOT))
@Meta(AccessValueTypeProvider, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getaccessvaluetype`, '@container', '@name', NODE_SELF))
class AppSchemaMeta implements AppSchema {
  @Meta(PrimaryIndex, 0)
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  container?: string;

  /** The name of the app */
  @Meta(PrimaryIndex, 1)
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  name: string;
}

/** Represents the app type */
@Meta(OfSchema, SCHEMA_KIND_STRING)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
@Meta(Base, NS_SYSTEM_STRING)
@Meta(UpLimitString, PRIMARY_KEY_MAX_LEN)
@Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappentries`, NODE_SELF, ENTRY_ROOT))
class AppTypeMeta {}