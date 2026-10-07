import { Alias, Meta, ForSchema, OfNodeKind, SchemaType, Property, PropertyValueType, InVisible, Static, ReadOnly } from "schema-node-core";

import { NODE_KIND_PROPERTY, NS_SYSTEM_BOOL } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP } from "../../../utils/constant";

@Meta(Alias, 'dataRead')
@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.DataRead`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
@Meta(Static, true)
@Meta(InVisible, true)
@Meta(ReadOnly, true)
export class DataRead extends Property<boolean> {}
