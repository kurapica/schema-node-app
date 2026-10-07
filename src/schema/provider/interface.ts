import { PolicyScope } from "../../enum/policyScope";
import { WorkflowStatus } from "../../enum/workflowStatus";

import type { INodeSchemaProvider } from "schema-node-core";
import type { AppSchema, IAppDataFieldPushQuery, IAppDataPushResult, IAppDataQuery, IBatchQueryAppDataResult } from "../app/type";

interface ISchemaApiProtocolRequestMeta {
  wrap?: string;
  fields?: Record<string, any>;
}

interface ISchemaApiProtocolResponseMeta {
  unwrap?: string;
  fields?: Record<string, any>;
}

export interface ISchemaApiProtocolMeta {
  name?: string;
  request?: ISchemaApiProtocolRequestMeta;
  response?: ISchemaApiProtocolResponseMeta;
  schemaFormat?: string[];
  kindProperties?: Record<string, string[]>;
  error?: string[];
}

/**
 * The Application field data schema provider
 */
export interface IAppSchemaProvider extends INodeSchemaProvider {
  /**
   * Get the schema api protocol information
   */
  protocol(): Promise<ISchemaApiProtocolMeta | undefined>;

  /**
   * Load the application schema information
   * @param app the name of the application
   * @return the application schema
   */
  getAppSchema(
    app: string,
    includeTypes?: boolean,
    format?: string,
  ): Promise<AppSchema | undefined>;

  /**
   * Authorize the policy for the scope
   * @param scope The policy scope
   * @param name The schema type name
   * @param app The application name
   * @param field The field name
   * @param workflow The workflow name
   */
  authorize(
    scope: PolicyScope,
    name?: string,
    app?: string,
    field?: string,
    workflow?: string,
  ): Promise<boolean>;

  /**
   * Batch query the application data from server
   */
  batchQueryAppData(
    queries: IAppDataQuery[],
  ): Promise<IBatchQueryAppDataResult>;

  /**
   * push the application data to server
   */
  pushAppData(
    app: string,
    target: string,
    datas: { [key: string]: IAppDataFieldPushQuery },
  ): Promise<IAppDataPushResult>;

  /**
   * Process the interaction workflow request
   * @param app The application name
   * @param target The application target
   * @param workflow The workflow name
   * @param node The workflow node name
   * @param workflowId The workflow instance id
   * @param data The interaction form data
   * @param terminate Whether to terminate the workflow after interaction
   */
  interaction(
    app: string,
    target: string,
    workflow: string,
    node?: string,
    workflowId?: string,
    data?: any,
    terminate?: boolean,
  ): Promise<string | undefined>;

  /**
   * Gets the workflow status info
   * @param app The application
   * @param workflow The workflow
   * @param workflowId The workflow id
   */
  workflowInfo(
    app: string,
    workflow: string,
    workflowId: string,
  ): Promise<WorkflowStatus>;
}
