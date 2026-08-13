import { PolicyScope, WorkflowStatus } from "../../enum";
import { postSchemaApi } from "./protocol";
import { useAppSchemaProvider } from "./appSchemaProvider";

import type { NodeSchema } from "schema-node-core";
import type { AppSchema } from "../app";
import type { IAppSchemaProvider, ISchemaApiProtocolMeta, IAppDataQuery, IBatchQueryAppDataResult, IAppDataFieldPushQuery, IAppDataPushResult } from "./interface";

/** The default app schema provider */
const defaultAppSchemaProvider: IAppSchemaProvider = {
  
  protocol: async (): Promise<ISchemaApiProtocolMeta | undefined> => {
    return (await postSchemaApi("/protocol", {}, true)) || undefined;
  },

  getSchema: async (names: string[]): Promise<NodeSchema[]> => {
    return (await postSchemaApi("/get-schema", { names }))?.schemas || [];
  },

  getAppSchema: async (name: string, includeTypes?: boolean, format?: string): Promise<AppSchema | undefined> => {
    return (await postSchemaApi("/get-app-schema", {name, includeTypes, format}))?.schema;
  },

  callFunction: async (name: string, args: any[], retType?: string): Promise<any> => {
    return (await postSchemaApi("/call-function", { name, args, return: retType }))?.result;
  },

  authorize: async (scope: PolicyScope = PolicyScope.DataRead, name?: string, app?: string, field?: string,  workflow?: string): Promise<boolean> => {
    return (await postSchemaApi("/authorize", { name, app, field, workflow, scope }))?.result;
  },

  batchQueryAppData: async function (queries: IAppDataQuery[]): Promise<IBatchQueryAppDataResult> {
    return await postSchemaApi("/batch-query-app-data", { queries });
  },

  pushAppData: async function (app: string, target: string, datas: { [key: string]: IAppDataFieldPushQuery }): Promise<IAppDataPushResult> {
    return await postSchemaApi("/push-app-data", { app, target, datas });
  },

  interaction: async function (app: string, target: string, workflow: string, node?: string, workflowId?: string, data?: any, terminate?: boolean): Promise<string | undefined> {
    return (await postSchemaApi("/interaction", { app, target, workflow, node, workflowId, data, terminate}))?.workflowId;
  },

  workflowInfo: async function ( app: string, workflow: string, workflowId: string ): Promise<WorkflowStatus> {
    return (await postSchemaApi("/workflow-info", { app, workflow, workflowId }))?.status;
  },
};

/** Register the default schema provider */
useAppSchemaProvider(defaultAppSchemaProvider);