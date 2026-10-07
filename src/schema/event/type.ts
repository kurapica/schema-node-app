import type { FuncArg } from "schema-node-core";

/** The event schema */
export interface EventSchema {
    /** The event arguments */
    args?: FuncArg[];

    /** The payload schema type */
    payload?: string;
}
