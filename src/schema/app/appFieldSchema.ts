import { Append, Attach, buildFuncCall, Call, Default, Description, Disable, Display, DisplayOnly, EntrySource, InVisible, Meta, NODE_SELF, NS_SYSTEM_BOOL, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_LIST, NS_SYSTEM_LOGIC, NS_SYSTEM_SCHEMA_ARRAY, NS_SYSTEM_SCHEMA_FUNC_TYPE, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, PrimaryIndex, Relation, Require, SCHEMA_KIND_ARRAY, SchemaKind, SchemaType, Valid, Visible } from "schema-node-core";
import { DataCombineType } from "../../enum/dataCombineType";
import { NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_ORDER_APP_FIELD } from "../../utils/constant";

export interface AppFieldSchema {
  /** The application name */
  app: string;

  /** The name of the field */
  name: string;

  /** The type of the field */
  type: string;

  //#region Source Push

  /** The input source field */
  source?: string;

  /** The push function, convert the input data to the type data */
  push?: string;

  /** The combine rule for scalar/enum type */
  combine?: DataCombineType;

  /** The combine rule for struct/struct-array type */
  combines?: DataCombine[];

  //#endregion

  //#region Foreign & View

  /** The foreign settings */
  foreigns?: Foreign[];

  /** The field view settings */
  view?: FieldView;

  //#endregion

  //#region Status

  /** The error message of the field */
  error?: string;

  //#endregion
}

/** The foreign settings */
export interface Foreign {
  /** The foreign application name */
  app: string;

  /** The field refer to the other app target */
  field: string;
}

/** The field view settings */
export interface FieldView {
  /** The source application name */
  app: string;

  /** The source field name */
  field: string;

  /** The target map field */
  map: string;
}

/** The data combine settings */
export interface DataCombine {
  /** The field name */
  field: string;

  /** The combine rule */
  type: DataCombineType;
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

  //#region Source Push

  /** The input source field */
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfields`, '@app'))
  source?: string;

  /** The type of the input source field */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  @Meta(DisplayOnly, true)
  @Meta(InVisible, true)
  @Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfieldtype`, '@app', '@source', true))
  sourceType?: string;

  /** The push function, convert the input data to the type data */
  @Meta(SchemaType, NS_SYSTEM_SCHEMA_FUNC_TYPE)
  @Relation(Visible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.notempty`, '@source'))
  @Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NODE_SELF, "@sourceType"))
  @Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NODE_SELF, "@type", true))
  push?: string;

  /** The combine rule for scalar/enum type */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_ARRAY}.combinetype`)
  combine?: DataCombineType;

  /** The combine rule for struct/struct-array type */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combines`)
  combines?: DataCombine[];

  //#endregion

  //#region Foreign & View

  /** The foreign settings */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreigns`)
  foreigns?: Foreign[];

  /** The field view settings */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.view`)
  view?: FieldView;

  //#endregion
}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.foreign`)
class ForeignMeta implements Foreign {
  /** The foreign application name */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(Require, true)
  app: string;

  /** The field refer to the other app target */
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(Require, true)
  @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfields`, '@app'))
  field: string;
}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.view`)
class FieldViewMeta implements FieldView {
  /** The source application name */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.type`)
  @Meta(Require, true)
  app: string;

  /** The source field name */
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(Require, true)
  @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfields`, '@app'))
  field: string;

  /** The target map field */
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(Require, true)
  map: string;
}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combine`)
class DataCombineMeta implements DataCombine {
  /** The field name */
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  field: string;

  /** The combine rule */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_ARRAY}.combinetype`)
  @Meta(Require, true)
  type: DataCombineType;
}