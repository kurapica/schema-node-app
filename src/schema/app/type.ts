import { AppScopeType } from "../../enum/appScopeType";

import type { INodeReference, IPropertyProvider, IRelation, IValueAccess, IValueTypeAccess, NodeSchema, SchemaLoadState } from "schema-node-core";
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

  /** The load state of the app */
  loadState?: SchemaLoadState;
}

/** The application interface */
export interface IAppType extends IValueTypeAccess, IPropertyProvider {
  get container(): IAppType | undefined;

  /** The application name */
  get name(): string;

  /** The application scope type */
  get scopeType(): AppScopeType;

  get hasSubApps(): boolean;

  /** The application is loaded */
  loaded?: boolean;

  /** Save an application schema */
  saveSubAppSchema(schema: AppSchema | AppSchema[], reload?:boolean): void;

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

  getField(name: string): IAppFieldType | undefined;

  getWorkflows(): Generator<IAppWorkflowType>;

  getWorkflow(name: string): IAppWorkflowType | undefined;

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

  create(appNode: IAppNode, data: unknown): IValueAccess;

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

export function isAppNode(obj: unknown): obj is IAppNode {
  return (obj as Record<string, IAppType>)?.appType !== undefined;
}