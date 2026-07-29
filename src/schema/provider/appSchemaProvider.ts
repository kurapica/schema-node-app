import { debounce, deepClone, isNull, NodeSchema, SchemaLoadState, useSchemaProvider } from "schema-node-core";
import { getSchemaApiBaseUrl, ISchemaApiProtocolMeta, postSchemaApi } from "./protocol";
import { WorkflowStatus } from "../../enum/workflowStatus";
import { IAppDataFieldPushQuery, IAppDataPushResult, IAppDataQuery, IAppDataResult, IAppSchemaProvider, IBatchQueryAppDataResult } from "./interface";
import { AppSchema } from "../app/appSchema";
import { PolicyScope } from "../../enum/policyScope";
import { AppScopeType } from "../../enum/appScopeType";

let DEBOUNCE_BATCH_QUERY = 50;
let schemaProvider: IAppSchemaProvider | null = null;

/** The default app schema provider */
export const defaultAppSchemaProvider: IAppSchemaProvider = {
  
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
useSchemaProvider(defaultAppSchemaProvider);

/**
 * Sets the data schema provider
 */
export function useAppSchemaProvider(
  provider: IAppSchemaProvider,
  debounce: number = 50,
): void {
  schemaProvider = provider;
  DEBOUNCE_BATCH_QUERY = debounce || 50;
  useSchemaProvider(provider);
}

/**
 * Gets the data schema provider
 */
export function getAppSchemaProvider(): IAppSchemaProvider | null {
  return schemaProvider ?? (getSchemaApiBaseUrl() ? defaultAppSchemaProvider : null);
}

//#endregion

//#region Get app data result api

let appDataQueryQueue: {
  query: IAppDataQuery;
  resolve: Function;
  reject: Function;
}[] = [];

/**
 * Process the app data query with auto combine
 */
export function queryAppData(query: IAppDataQuery): Promise<IAppDataResult> {
  query.app = query.app.toLowerCase();
  const cacheSchema = getAppCachedSchema(query.app);

  // check
  if (!query.workflow && (isNull(query.target) || query.schemaOnly)) {
    if (cacheSchema)
      return new Promise((resolve, _) =>
        resolve({
          app: query.app,
          target: query.target,
          schema: !query.noSchema ? cacheSchema : undefined,
          results: {},
          infos: {},
        }),
      );

    query.schemaOnly = true;
    query.noSchema = undefined;
  }

  if (!getAppSchemaProvider()) throw "No App data provider";
  if (isNull(query.noSchema) && cacheSchema) query.noSchema = true;

  // prepare the query
  processAppDataQueryQueue();
  return new Promise((resolve, reject) =>
    appDataQueryQueue.push({ query, resolve, reject }),
  );
}

// process the app data batch query
const processAppDataQueryQueue = debounce(() => {
  const queue = appDataQueryQueue;
  appDataQueryQueue = [];
  if (!queue.length) return;

  //#region combine
  const combineQueries: IAppDataQuery[] = [];
  const schemaLoaded = new Set<string>();

  // with target
  queue
    .filter((q) => !isNull(q.query.target))
    .forEach((q) => {
      // schema only load once
      if (!q.query.noSchema) {
        if (schemaLoaded.has(q.query.app)) q.query.noSchema = true;
        else schemaLoaded.add(q.query.app);
      }

      // combine query
      const exist = combineQueries.find(
        (c) => c.app === q.query.app && c.target === q.query.target,
      );
      if (exist) {
        // combine fields, 0 means all
        if (exist.fields.length) {
          if (!q.query.fields.length) {
            exist.fields = [];
          } else {
            exist.fields.splice(
              exist.fields.length,
              0,
              ...q.query.fields.filter((f) => !exist.fields.includes(f)),
            );
          }
        }

        // combine querys
        if (exist.querys) {
          if (q.query.querys) {
            for (let k in q.query.querys) {
              if (!exist.querys[k])
                exist.querys[k] = deepClone(q.query.querys[k]);
            }
          }
        } else if (q.query.querys) {
          exist.querys = deepClone(q.query.querys);
        }

        // combine others
        if (isNull(exist.take)) exist.take = q.query.take;
        if (isNull(exist.descend)) exist.descend = q.query.descend;
        exist.schemaOnly = exist.schemaOnly && q.query.schemaOnly;
        exist.noSchema = exist.noSchema && q.query.noSchema;
        exist.workflow = exist.workflow || q.query.workflow;
      } else {
        combineQueries.push(deepClone(q.query));
      }
    });

  // without target, schema only
  queue
    .filter((q) => isNull(q.query.target))
    .forEach((q) => {
      const exist = combineQueries.find((c) => c.app === q.query.app);
      if (exist) exist.noSchema = false;
      else combineQueries.push(deepClone(q.query));
    });

  //#endregion

  // process
  let provider = getAppSchemaProvider();
  provider
    ?.batchQueryAppData(combineQueries)
    .then((res) => {
      // reg schema
      if (res.schemas?.length)
        registerSchema(res.schemas, SchemaLoadState.Service);
      registerAppSchema(
        res.results?.filter((r) => r.schema).map((r) => r.schema!) || [],
        SchemaLoadState.Service,
      );

      // resolve
      queue.forEach((q) => {
        if (getAppCachedSchema(q.query.app).scopePolicy?.type === AppScopeType.SystemLevel)
        {
          const result = res.results.find((r) => r.app === q.query.app);
          if (result) {
            q.resolve(result);
          } else {
            q.reject(`Unable to load app data ${q.query.app}`);
          }
        }
        else if (!isNull(q.query.target)) {
          const result = res.results.find(
            (r) => r.app === q.query.app && r.target === q.query.target,
          );
          if (result) {
            q.resolve(result);
          } else {
            q.reject(
              `Unable to load app data ${q.query.app} for ${q.query.target}`,
            );
          }
        } else {
          const result = res.results.find(
            (r) => r.app === q.query.app && r.schema,
          );
          if (result) {
            q.resolve({
              app: q.query.app,
              target: q.query.target,
              schema: result.schema,
              results: {},
              infos: {},
            });
          } else {
            q.reject(`Unable to get the app schema for ${q.query.app}`);
          }
        }
      });
    })
    .catch((ex) => queue.forEach((q) => q.reject(ex)));
}, DEBOUNCE_BATCH_QUERY);

//#endregion