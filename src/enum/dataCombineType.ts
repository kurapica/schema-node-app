import { FromEnum, Meta, OfSchema, SchemaType } from "schema-node-core";

import { SCHEMA_KIND_ENUM } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP_FIELD } from "../utils/constant";

export enum DataCombineType
{
    /// <summary>
    /// Assign
    /// </summary>
    Newest = "newest",
    
    /// <summary>
    /// Init
    /// </summary>
    Oldest = "oldest",

    /// <summary>
    /// Sum
    /// </summary>
    Sum = "sum",

    /// <summary>
    /// Count
    /// </summary>
    Count = "count",
}

export type DataCombineTypeValue = `${DataCombineType}`

/** The enum value type schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.combinetype`)
@Meta(FromEnum, DataCombineType)
class DataCombineTypeMeta {}
