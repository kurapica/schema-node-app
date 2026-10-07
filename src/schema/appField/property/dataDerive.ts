import { Any, ARRAY_ELEMENT, Assign, BlackList, buildFuncCall, Call, Default, DisplayOnly, EntrySource, ForSchema, InVisible, Meta, NS_SYSTEM_LOGIC, OfNodeKind, PrimaryIndex, Property, PropertyValueType, Relation, Require, SchemaType, Static, Valid, Visible, WhiteList } from "schema-node-core";
import { DataCombineType } from "../../../enum/dataCombineType";

import { ARRAY_PREVIOUS, NODE_SELF, NS_SYSTEM_COLLECTION, NS_SYSTEM_IDENTIFIER, NS_SYSTEM_INTRINSIC, NS_SYSTEM_SCHEMA_FUNC_TYPE, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, NS_SYSTEM_SCHEMA_REFLECT_TYPE, NODE_KIND_BOOL, NODE_KIND_DATE, NODE_KIND_DECIMAL, NODE_KIND_ENUM, NODE_KIND_INT, NODE_KIND_PROPERTY, NODE_KIND_STRING, NODE_KIND_STRUCT } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_REFLECT_APP } from "../../../utils/constant";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP, NS_SYSTEM_SCHEMA_APP_FIELD } from "../../../utils/constant";

export interface Derive {
  source?: string;
  calc?: string;
  combine?: DataCombineType;
  combines?: FieldCombine[];
}

export interface FieldCombine {
  field: string;
  type?: DataCombineType;
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.dataDerive`)
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.derive`)
@Meta(Static, true)
@Relation(InVisible, Call, buildFuncCall(`${NS_SYSTEM_LOGIC}.neq`, '@enableStorage', true))
@Relation(EntrySource, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfields`, '@app'), 'dataDerive.source')
@Relation(BlackList, Call, buildFuncCall(`${NS_SYSTEM_COLLECTION}.newarray`, '@name'), 'dataDerive.source')
@Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getappfieldtype`,  '@app', `@dataDerive.source`, true), 'dataDerive.sourceType')
@Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_INTRINSIC}.assign`, '@type'), 'dataDerive.fieldType')
export class DataDerive extends Property<Derive> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.derive`)
class DeriveMeta implements Derive {
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(Require, true)
  source!: string;

  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  @Meta(DisplayOnly, true)
  @Meta(InVisible, true)
  fieldType?: string;

  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  @Meta(DisplayOnly, true)
  @Meta(InVisible, true)
  sourceType?: string;

  @Meta(SchemaType, NS_SYSTEM_SCHEMA_FUNC_TYPE)
  @Relation(Valid, Assign, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NODE_SELF, '@sourceType'))
  @Relation(Valid, Assign, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, NODE_SELF, '@fieldType', true))
  @Meta(Require, true)
  calc!: string;

  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combinetype`)
  @Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, '@fieldType', true, NODE_KIND_ENUM, NODE_KIND_BOOL, NODE_KIND_STRING, NODE_KIND_INT, NODE_KIND_DECIMAL, NODE_KIND_DATE))
  @Relation(WhiteList, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getcombinetype`, '@fieldType'))
  combine?: DataCombineType;

  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combines`)
  @Relation(Visible, Call, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_NODE_KIND, '@fieldType', true, NODE_KIND_STRUCT))
  @Relation(EntrySource, Assign, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getcombinefields`, '@fieldType'), `combines.${ARRAY_ELEMENT}.field`)
  @Relation(BlackList, Call, buildFuncCall(`${NS_SYSTEM_COLLECTION}.getfields`, `@combines.${ARRAY_PREVIOUS}`, 'field'), `combines.${ARRAY_ELEMENT}.field`)
  @Relation(Default, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.getaccessvaluetype`, '@fieldType', `combines.${ARRAY_ELEMENT}.field`), `combines.${ARRAY_ELEMENT}.fieldType`)
  combines?: FieldCombine[];
}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combine`)
class FieldCombineMeta implements FieldCombine {
  @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
  @Meta(PrimaryIndex, 0)
  @Meta(Require, true)
  field: string;

  @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
  @Meta(DisplayOnly, true)
  @Meta(InVisible, true)
  fieldType?: string;

  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combinetype`)
  @Relation(WhiteList, Call, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_APP}.getcombinetype`, '@fieldType'))
  type?: DataCombineType;
}
