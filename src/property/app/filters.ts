import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, NS_SYSTEM_IDENTIFIER, PropertyValueType } from "schema-node-core";
import { SCHEMA_KIND_APP_FIELD, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_APP_FIELD } from "../../utils/constant";
import { FieldFilterMode, FieldFilterResolve } from "../../enum/fieldFilterMode";

export interface FieldFilter {
    mode: FieldFilterMode;
    filter: string;
    resolve?: FieldFilterResolve;
}

@Meta(ForSchema, [SCHEMA_KIND_APP_FIELD])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.filters`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filters`)
export class Filters extends Property<FieldFilter[]> {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filter`)
class FieldFilterMeta implements FieldFilter {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filtermode`)
    mode: FieldFilterMode;

    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    filter: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filterresolve`)
    resolve?: FieldFilterResolve;
}