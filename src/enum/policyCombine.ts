import { Meta, OfSchema, SCHEMA_KIND_ENUM, SchemaType, FromEnum } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP } from "../utils";

export enum PolicyCombine {
    /// <summary>
    /// auth1 && auth2
    /// </summary>
    AndAlso = "andAlso",
    
    /// <summary>
    /// auth1 || auth2
    /// </summary>
    OrElse = "orElse",
}

export type PolicyCombineValue = `${PolicyCombine}`

/** The schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.combine`)
@Meta(FromEnum, PolicyCombine)
class PolicyCombineMeta {}