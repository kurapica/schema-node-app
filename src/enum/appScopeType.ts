
/// <summary>
/// The application target policy type

import { Meta, OfSchema, SchemaType, FromEnum } from "schema-node-core";

import { SCHEMA_KIND_ENUM } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP } from "../utils";

/// </summary>
export enum AppScopeType
{
    /// <summary>
    /// Use target, the default policy
    /// </summary>
    BusinessTarget = "businessTarget",
    
    /// <summary>
    /// No target, system app
    /// </summary>
    SystemLevel = "systemLevel",
    
    /// <summary>
    /// Use context item for data isolation like tenate id, org id
    /// </summary>
    IsolationContext = "isolationContext",
}

export type AppScopeTypeValue = `${AppScopeType}`

/** The schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.scope`)
@Meta(FromEnum, AppScopeType)
class AppScopeTypeMeta {}