import { type DataCombineTypeValue } from "../enum/dataCombineType";
import { type FieldFilterResolveValue, type FieldFilterModeValue } from "../enum/fieldFilterMode";
import { type FieldStorageTopologyValue } from "../enum/fieldStorageTopology";
import { type ILocaleString } from "../utils/locale";
import { type IDataCombine } from "./arraySchema";
import { type IPolicyItem } from "./policySchema";

/**
 * The application field scehma
 */
export interface IAppFieldSchema {
  /**
   * The application name
   */
  app: string;

  /**
   * The field name
   */
  name: string;

  /**
   * The field type
   */
  type: string;

  /**
   * The display name
   */
  display?: ILocaleString;

  /**
   * The description
   */
  desc?: ILocaleString;

  /**
   * The field storage topology, default is co-located
   */
  topology?: FieldStorageTopologyValue;

  /**
   * The dynamic table name
   */
  tableName?: string;

  /**
   * The attribute table name when topology is attribute-based
   */
  attrTableName?: string;

  /**
   * The function used to generate data
   */
  func?: string;

  /**
   * The source field that push data to the field with the func
   */
  arg?: string;

  /**
   * The field is using increase update, not full-data update
   */
  incrUpdate?: boolean;

  /**
   * The field is front-end only, no need store data
   */
  frontend?: boolean;

  /**
   * The field is disabled
   */
  disable?: boolean;

  /**
   * The field is readonly
   */
  readonly?: boolean;

  /**
   * Enable the clear value option
   */
  allowClear?: boolean;

  /**
   * The combine rule if field type is scalar or enum
   */
  combine?: DataCombineTypeValue;

  /**
   * The combine rule if field type is struct or struct-array
   */
  combines?: IDataCombine[];

  /**
   * The data authorization policies for the field, normally the row access policies
   */
  auths: IPolicyItem[];

  /**
   * Row filter policies
   */
  rowAuths?: IRowPolicy[];

  /**
   * Column access policies
   */
  colAuths?: IColPolicy[];

  /**
   * The field filters
   */
  filters?: IFieldFilter[];

  /**
   * The foreign field references
   */
  foreigns?: IForeign[];

  /**
   * The field view from other app
   */
  view?: IFieldView;
}

/**
 * The row policy item
 */
export interface IRowPolicy {
  /**
   * The policy evaluatorm, if true will use the filter
   */
  evaluator: string;

  /**
   * The row filter function
   */
  filter?: string;
}

/**
 * The column policy item
 */
export interface IColPolicy {
  /**
   * The struct field name
   */
  name: string;

  /**
   * The column access evaluators
   */
  evaluators: string[];
}

/**
 * The field filter
 */
export interface IFieldFilter {
  /**
   * The field name or filter function
   */
  filter: string;

  /**
   * The filter mode
   */
  mode: FieldFilterModeValue;

  /**
   * The filter resolve strategy
   */
  resolve?: FieldFilterResolveValue;
}

/**
 * The foreign field reference
 */
export interface IForeign{
  /**
   * The key field
   */
  field: string;

  /**
   * The reference app
   */
  app: string;
}

/**
 * The field view
 */
export interface IFieldView{

  /**
   * The source app
   */
  app: string;

  /**
   * The source field
   */
  field: string;

  /**
   * The source app target map field
   */
  map: string;
}