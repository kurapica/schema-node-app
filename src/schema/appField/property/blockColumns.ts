import { Meta, ForSchema, OfNodeKind, SchemaType, Property, PropertyValueType, InVisible } from "schema-node-core";

import { NODE_KIND_PROPERTY, NS_SYSTEM_LIST, NS_SYSTEM_STRING } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PRO_APP } from "../../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.blockColumns`)
@Meta(PropertyValueType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}>`)
@Meta(InVisible, true)
export class BlockColumns extends Property<string[]> {}
