import type { FuncArg } from "schema-node-core";

export interface WorkflowSchema {
    /** The workflow schema kind */
    kind: string;

    /** The workflow payload schema type */
    payload?: string;

    /** The workflow settings schema type for creation */
    settings?: string;

    /** The workflow session schema type for processing */
    session?: string;

    /** The workflow arguments */
    args?: FuncArg[];
}
