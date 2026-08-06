import { Append, Attach, Base, buildFuncCall, Description, Display, ENTRY_ROOT, EntrySource, Meta, NODE_SELF, NodeSchema, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_SCHEMA_REFLECT, NS_SYSTEM_STRING, OfSchema, PRIMARY_KEY_MAX_LEN, PrimaryIndex, Relations, SCHEMA_KIND_STRING, SchemaKind, SchemaLoadState, SchemaType, UpLimitString } from "schema-node-core";
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

@Meta(SchemaKind, [SCHEMA_KIND_APP, SCHEMA_KIND_ORDER_APP])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.schema`)
@Meta(Append, [Display, Description, Relations])
@Meta(Attach, SCHEMA_KIND_APP)
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