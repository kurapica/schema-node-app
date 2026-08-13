import { Meta, OfSchema, SchemaType, FromEnum } from "schema-node-core"

import { SCHEMA_KIND_ENUM } from "schema-node-core"
import { NS_SYSTEM_SCHEMA_APP_FIELD } from "../utils"

/**
 * The field filter modes
 */
export enum FieldFilterMode
{
    Exactly = "exactly",
    Prefix = "prefix",
    Suffix = "suffix",
    Contains = "contains",
    Filter = "filter",
}

export type FieldFilterModeValue = `${FieldFilterMode}`

/** The schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filtermode`)
@Meta(FromEnum, FieldFilterMode)
class FieldFilterModeMeta {}

export enum FieldFilterResolve
{
    CascadeParent = "cascadeParent",
}

export type FieldFilterResolveValue = `${FieldFilterResolve}`

/** The schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.filterresolve`)
@Meta(FromEnum, FieldFilterResolve)
class FieldFilterResolveMeta {}

