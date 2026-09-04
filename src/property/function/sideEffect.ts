import { Meta, ForSchema, OfSchema, SchemaType, Property, PropertyValueType, Static, ReadOnly, InVisible } from "schema-node-core";

import { SCHEMA_KIND_PROPERTY, SCHEMA_KIND_FUNCTION, NS_SYSTEM_SCHEMA_PRO_FUNC, NS_SYSTEM_BOOL } from "schema-node-core";

@Meta(ForSchema, [SCHEMA_KIND_FUNCTION])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_FUNC}.sideEffect`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
@Meta(Static, true)
@Meta(ReadOnly, true)
@Meta(InVisible, true)
export class SideEffect extends Property<boolean> {}