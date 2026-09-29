import { AppScopeType } from "../../enum/appScopeType";

import type { INodeReference, IPropertyProvider, IRelation, IValueAccess, IValueTypeAccess, NodeSchema } from "schema-node-core";
import type { AppFieldSchema } from "../appField/type";
import type { AppWorkflowNodeSchema, AppWorkflowSchema } from "../appWorkflow/type";

export interface AppSchema {
  /** The container for the app */
  container?: string;

  /** The name of the app */
  name: string;

  /** Whether the app is a container app */
  hasApps?: boolean;

  /** Whether the app has fields */
  hasFields?: boolean;

  /** Whether the app is a system app */
  system?: boolean;
  
  /** Whether the app can create schemas */
  schemaCreate?: boolean,

  /** Whether the app can read schemas */
  schemaRead?: boolean,
  
  /** Whether the app can update schemas */
  schemaUpdate?: boolean,
  
  /** Whether the app can delete schemas */
  schemaDelete?: boolean

  /** The sub-apps of the app */
  apps?: AppSchema[];

  /** The fields of the app */
  fields?: AppFieldSchema[];

  /** The workflows of the app */
  workflows?: AppWorkflowSchema[];

  /** The node schemas of the app */
  nodeSchemas?: NodeSchema[];

  /** The error message */
  error?: string;
}

/** The application interface */
export interface IAppType extends IValueTypeAccess, IPropertyProvider {
  get container(): IAppType | undefined;

  /** The application name */
  get name(): string;

  /** The application scope type */
  get scopeType(): AppScopeType;

  get hasSubApps(): boolean;

  /** Whether the app has fields */
  get hasFields(): boolean;

  /** The application is loaded */
  loaded?: boolean;

  /** Save an application schema */
  saveSubAppSchema(schema: AppSchema | AppSchema[], reload?:boolean): void;

  /** Remove a sub-application schema */
  removeSubAppSchema(name: string): void;

  /** Get a sub-application type by name */
  getSubAppType(name: string): IAppType | undefined;

  /** Save a sub-application type */
  saveSubAppType(name: string, app: IAppType): void;

  /** Get an application schema by name */
  getSubAppSchema(name: string): AppSchema | undefined 
  
  /** Get all sub-application schemas */
  getSubAppSchemas(): Generator<AppSchema>;

  /** Gets the application schema */
  getAppSchema(): AppSchema;

  getFields(): Generator<IAppFieldType>;

  /** Get a field by name */
  getField(name: string): IAppFieldType | undefined;

  /** Remove a field */
  removeField(name: string): void;

  /** Swap two fields */
  swapField(field: string, other: string): void;

  /** Save a field */
  saveField(field: AppFieldSchema): Promise<boolean>;
  
  getWorkflows(): Generator<IAppWorkflowType>;

  getWorkflow(name: string): IAppWorkflowType | undefined;

  /** Remove a workflow */
  removeWorkflow(name: string): boolean;

  /** Save a workflow */
  saveWorkflow(workflow: AppWorkflowSchema): Promise<boolean>;

  getRelations(): Generator<IRelation>;

  load(schema: AppSchema): Promise<void>;
}

export interface IAppFieldType extends INodeReference, IPropertyProvider {
  /** The application contains the field */
  get application(): IAppType;

  /** The field name */
  get name(): string;

  /** The field type */
  get type(): string;

  /** The value type */
  get valueType(): IValueTypeAccess;

  create(appNode: IAppNode, data?: IAppDataFieldResult): IValueAccess;

  /** Gets the field schema */
  getFieldSchema(): AppFieldSchema;
}

export interface IAppWorkflowType extends INodeReference {
  /** The application contains the field */
  get application(): IAppType;

  /** The workflow name */
  get name(): string;

  /** The active flag */
  get active(): boolean;

  /** The workflow nodes */
  get nodes(): AppWorkflowNodeSchema[];

  /** Gets the workflow schema */
  getWorkflowSchema(): AppWorkflowSchema;
}

export interface IAppNode extends IValueAccess {
  /** The application type */
  get appType(): IAppType;

  /** The application target */
  get target(): string | undefined;
}


/**
 * The app data query
 */
export interface IAppDataQuery {
  /**
   * The application name
   */
  app: string;

  /**
   * The application target
   */
  target: string;

  /**
   * The query fields, empty means query all
   */
  fields: string[];

  /**
   * Only query input fields
   */
  onlyInput?: boolean;

  /**
   * Only query output fields
   */
  onlyOutput?: boolean;

  /**
   * The query detail for array fields
   */
  querys?: { [key: string]: IAppDataFieldQuery };

  /**
   * The default query count
   */
  take?: number;

  /**
   * Use descend order as default
   */
  descend?: boolean;

  /**
   * Only query the application schema
   */
  schemaOnly?: boolean;

  /**
   * Don't include the type schema
   */
  noSchema?: boolean;

  /**
   * Query interaction workflow data
   */
  workflow?: boolean;
}

/**
 * The app data field query
 */
export interface IAppDataFieldQuery {
  /**
   * The key to be query, like
   *
   * filter: { 'name': 'ann', class: 'math' }
   * filter: { 'name': ['ann', 'ben'] }
   */
  filter?: { [key: string]: any };

  /**
   * The order by
   */
  orderBy?: IAppDataQueryOrder[];

  /**
   * The query count
   */
  take?: number;

  /**
   * The query data offset
   */
  skip?: number;

  /**
   * Use descend order
   */
  descend?: boolean;
}

export interface IBatchQueryAppDataResult {
  /**
   * The query results
   */
  results: IAppDataResult[];

  /**
   * The node schemas required
   */
  schemas?: NodeSchema[];
}

/**
 * The app data query result
 */
export interface IAppDataResult {
  /**
   * The application name
   */
  app: string;

  /**
   * The application target
   */
  target: string;

  /**
   * The application schema
   */
  schema?: AppSchema;

  /**
   * The additional field data info
   */
  results: { [key: string]: IAppDataFieldResult };

  /**
   * The workflow states for interaction workflow data
   */
  workflows?: IAppWorkflowState[];
}

/**
 * The app data field query result info
 */
export interface IAppDataFieldResult {
  /** The app data create auth for the field. */
  dataCreate?: boolean;

  /** The app data read auth for the field. */
  dataRead?: boolean;

  /** The app data update auth for the field. */
  dataUpdate?: boolean;

  /** The app data delete auth for the field. */
  dataDelete?: boolean;

  /** Whether the field is queried */
  queried?: boolean;

  /** The query result */
  result?: any;

  /** The key of the query */
  filter?: { [key: string]: any };

  /** The order by */
  orderBy?: IAppDataQueryOrder[];

  /** The query count */
  take?: number;

  /** The query offset */
  skip?: number;

  /** The data total count */
  total?: number;

  /** Use descend order */
  descend?: boolean;
}

export interface IAppDataFieldPushQuery {
  /**
   * The update data, include new & update
   */
  data?: any;

  /**
   * The delete data from array node
   */
  deletes?: any[];
}

/**
 * The data push result
 */
export interface IAppDataPushResult {
  /**
   * The push result
   */
  result: boolean;

  /**
   * The error result
   */
  error?: any;
}

/**
 * The query order
 */
export interface IAppDataQueryOrder {
  field: string;
  desc: boolean;
}

/**
 * The app workflow state
 */
export interface IAppWorkflowState {
  name: string;
  togglable: boolean;
  workflowId?: string;
}

export interface IAppInteractionWorkflow extends AppWorkflowSchema
{
    /**
     * Whether the workflow can be toggled on/off
     */
    togglable: boolean

    /**
     * The workflow identifier to be turned off
     */
    workflowId?: string
}
export function isAppNode(obj: unknown): obj is IAppNode {
  return (obj as Record<string, IAppType>)?.appType !== undefined;
}