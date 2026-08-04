import { Assign, buildFuncCall, Call, Default, DisplayOnly, EntrySource, ForSchema, InVisible, Meta, NODE_SELF, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, NS_SYSTEM_LOGIC, NS_SYSTEM_SCHEMA_FUNC_TYPE, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, OfSchema, PrimaryIndex, Property, PropertyValueType, Relation, Require, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_STRUCT, SchemaType, Static, Valid, Visible } from "schema-node-core";
import { DataCombineType } from "../../enum/dataCombineType";
import { NS_SYSTEM_SCHEMA_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_REFLECT_APP, SCHEMA_KIND_APP_FIELD } from "../../utils/constant";

/** The data derive settings */
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.dataDerive`)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.derive`)
@Meta(Static, true)
@Relation(Visible, Call, `${NS_SYSTEM_INTRINSIC}.{nameof(SystemIntrinsic.assign)}`, '@enableStorage')
@Relation(EntrySource, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfields`, '@app'), 'dataDerive.source')
@Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfieldtype`,  '@app', `@dataDerive.source`, true), 'dataDerive.sourceType')
@Relation(Valid, Assign, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NODE_SELF, '@type', true), 'dataDerive.calc')
@Relation(InVisible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, '@type', true, SCHEMA_KIND_STRUCT), 'dataDerive.combine')
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, '@type', true, SCHEMA_KIND_STRUCT), 'dataDerive.combines')
export class DataDerive extends Property<Derive> {}

/** The data derive setting */
export interface Derive {
  /** The source field name */
  source?: string;

  /** The calc expression */
  calc?: string;

  /** The combine type for scalar/enum values */
  combine?: DataCombineType;

  /** The field combine settings */
  combines?: FieldCombine[];
}

/** The field combine setting */
export interface FieldCombine {
  field: string;
  type?: DataCombineType;
}

/** The data derive meta */
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.derive`)
class DeriveMeta implements Derive {
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  source?: string;

  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  @Meta(DisplayOnly, true)
  @Meta(InVisible, true)
  sourceType?: string;

  @Meta(SchemaType, NS_SYSTEM_SCHEMA_FUNC_TYPE)
  @Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NODE_SELF, '@sourceType'))
  @Relation(Visible, Call, `${NS_SYSTEM_LOGIC}.notempty`, '@source')
  calc?: string;

  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combinetype`)
  combine?: DataCombineType;

  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combines`)
  combines?: FieldCombine[];
}

/** The field combine meta */
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combine`)
class FieldCombineMeta implements FieldCombine {
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  field: string;

  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combinetype`)
  type?: DataCombineType;
}