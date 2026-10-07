import type { CallArg, ValueType } from "schema-node-core";

/** The application workflow schema */
export interface AppWorkflowSchema {
  /** The application name */
  app: string;

  /** The name of the workflow */
  name: string;

  /** Whether the workflow is active */
  active: boolean;

  /** The workflow nodes */
  nodes: AppWorkflowNodeSchema[];

  /** The error message */
  error?: string;
}

/** The application workflow node schema */
export interface AppWorkflowNodeSchema {
  /** The workflow node name */
  name: string;

  /** The workflow node type */
  type: string;

  /** The workflow node payload */
  payload: string;

  /** The workflow node arguments */
  args?: CallArg[];

  /** The workflow node previous nodes */
  previous?: string[];

  /** The workflow node state */
  state?: unknown;

  /** Fork the workflow node for multiple instances */
  fork?: boolean;

  /** The fork key paths in the payload */
  forkKey?: string[];

  /** Whether the workflow node is un cancelable */
  unCancelable?: boolean;

  /** Whether the previous fork branches should be canceled */
  cancelPre?: boolean;

  /** Whether the payload node data should be saved */
  savePayload?: boolean;

  /** The error message */
  error?: string;

  /** The payload value type */
  payloadValueType?: ValueType;
}
