/// <summary>
/// The workflow status enum

import { FromEnum, Meta, OfSchema, SCHEMA_KIND_ENUM, SchemaType } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_WORKFLOW } from "../utils";

/// </summary>
export enum WorkflowStatus
{
    Waiting = "waiting",
    Running = "running",
    Done = "done",
    Error = "error",
    Terminated = "terminated"
}

export type WorkflowStatusValue = `${WorkflowStatus}`

/** The schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.status`)
@Meta(FromEnum, WorkflowStatus)
class WorkflowStatusMeta {}