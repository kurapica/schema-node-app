import { Meta, OfSchema, SchemaType, FromEnum } from "schema-node-core";

import { SCHEMA_KIND_ENUM } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP } from "../utils";

export enum PolicyScope {
    /**
     * Create Schema
     */
    SchemaCreate = "schemaCreate",
    
    /**
     * Read Schema
     */
    SchemaRead = "schemaRead",
    
    /**
     * Update Schema
     */
    SchemaUpdate = "schemaUpdate",
    
    /**
     * Delete Schema
     */
    SchemaDelete = "schemaDelete",

    /**
     * Create App Data
     */
    DataCreate = "dataCreate",
     
    /**
     * Read App Data
     */
    DataRead = "dataRead",
    
    /**
     * Write App Data
     */
    DataUpdate = "dataUpdate",

    /**
     * Delete App Data
     */
    DataDelete = "dataDelete",

    /**
     * Function execute
     */
    FuncExecute = "funcExecute",
}

export type PolicyScopeValue = `${PolicyScope}`

/** The schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.scope`)
@Meta(FromEnum, PolicyScope)
class PolicyScopeMeta {}