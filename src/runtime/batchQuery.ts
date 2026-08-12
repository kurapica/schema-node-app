// Batch query app data

import { isNull, debounce, deepClone, SchemaLoadState, getNodeType, type INamespaceNodeType, type NodeSchema, SCHEMA_KIND_NAMESPACE } from "schema-node-core";
import { AppScopeType } from "../enum/appScopeType";
import { getCachedAppType, saveAppSchema, getAppType } from "./appRuntime";
import type { IAppDataQuery, IAppDataResult } from "../schema/provider/interface";
import { getAppSchemaProvider } from "../schema/provider/appSchemaProvider";
import { type AppScopePolicy, ScopePolicy } from "../schema/app/property";

let DEBOUNCE_BATCH_QUERY = 50;

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
  const cacheApp = getCachedAppType(query.app);

  // check
  if (!query.workflow && (isNull(query.target) || query.schemaOnly)) {
    if (cacheApp)
      return new Promise((resolve, _) =>
        resolve({
          app: query.app,
          target: query.target,
          schema: undefined, // cached app type already has schema
          results: {},
          infos: {},
        }),
      );

    query.schemaOnly = true;
    query.noSchema = undefined;
  }

  if (!getAppSchemaProvider()) throw "No App data provider";
  if (isNull(query.noSchema) && cacheApp) query.noSchema = true;

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
      {
        res.schemas.forEach((schema) => _setLoadState(schema, SchemaLoadState.Service));
        (getNodeType('') as unknown as INamespaceNodeType)?.saveSubNodeSchema(res.schemas);
      }
      saveAppSchema(res.results?.filter((r) => r.schema).map((r) => r.schema!) || []);

      // resolve
      queue.forEach(async (q) => {
        if ((await getAppType(q.query.app))?.getProperty(ScopePolicy)?.getValue<AppScopePolicy>()?.type === AppScopeType.SystemLevel)
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

/** Set the load state flags for a schema and its children. */
function _setLoadState(schema: NodeSchema, loadStage: SchemaLoadState): void {
  schema.loadState ??= loadStage;
  schema.loadState! |= loadStage;

  if (schema.kind === SCHEMA_KIND_NAMESPACE && schema.schemas) {
    for (const child of schema.schemas) {
      _setLoadState(child, loadStage);
    }
  }
}