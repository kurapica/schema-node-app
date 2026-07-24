import { FromEnum, Meta, NS_SYSTEM_SCHEMA_ARRAY, OfSchema, SCHEMA_KIND_ENUM, SchemaType } from "schema-node-core";

export enum DataCombineType
{
    /**
     * Assign, always use last
     */
    Assign = "assign",

    /**
     * Use the first assign value
     */
    Init = "init",

    /**
     * Sum
     */
    Sum = "sum",

    /**
     * Count
     */
    Count = "count",
}

export type DataCombineTypeValue = `${DataCombineType}`

/** The enum value type schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_ARRAY}.combinetype`)
@Meta(FromEnum, DataCombineType)
class DataCombineTypeMeta {}
