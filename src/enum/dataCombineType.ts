import { FromEnum, Meta, OfSchema, SCHEMA_KIND_ENUM, SchemaType } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP_FIELD } from "../utils/constant";

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
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combinetype`)
@Meta(FromEnum, DataCombineType)
class DataCombineTypeMeta {}
