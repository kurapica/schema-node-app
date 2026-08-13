import { ArrayNode, ArrayType, DataNode, Display, FunctionType, StructType, ValueType, isNull, deepClone, debounce, getNodeType, getCachedNodeType } from "schema-node-core";
import { queryAppData } from "../runtime/batchQuery";
import { Filters } from "../schema/appField/property";
import { FieldFilterMode } from "../enum/fieldFilterMode";
import { isAppNode } from "../schema/app/type";

import type { LocaleString } from "schema-node-core";
import type { IAppDataFieldInfo, IAppDataQueryOrder } from "../schema/provider/interface";
import type { FieldFilter } from "../schema/appField/property";

/** The field filter info with input nodes */
export interface IArrayFieldFilter {
  /** The filter mode */
  mode: FieldFilterMode;
  /** The filter name (function name or field name) */
  filter: string;
  /** The input nodes for the filter */
  nodes?: DataNode[];
  /** The subscription handlers for auto filter */
  handlers?: Function[];
}

/** The pageable array data node */
export class PageNode extends ArrayNode {
  /** The field info for the pageable array */
  fieldInfo: IAppDataFieldInfo | undefined;

  /** The field filters with input nodes */
  private _appFieldFilter: IArrayFieldFilter[] = [];

  /** Gets the field filters with input nodes */
  get filters(): IArrayFieldFilter[] { return this._appFieldFilter; }

  /** The change tracker for the pageable array */
  private _tracker: { [key: string]: { origin?: {}; update?: {}; delete?: boolean } } = {};

  /** The current page number */
  get page(): number { return this.fieldInfo?.take ? Math.floor((this.fieldInfo.skip || 0) / this.fieldInfo.take) : 0 }

  /** The page item count */
  get pageCount() { return this.fieldInfo?.take }

  /** The total item count */
  get total() { return this.fieldInfo?.total ?? this.length }

  /** The query filter for the pageable array */
  get query() { return this.fieldInfo?.filter ? { ...this.fieldInfo.filter } : undefined }

  /** The query order by for the pageable array */
  get orderBy(): IAppDataQueryOrder[] { return deepClone(this.fieldInfo?.orderBy) || [] }

  /** Whether the pageable array has changed */
  get changed(): boolean {
    if (this._elements.some((e) => e.changed)) return true;
    for (let key in this._tracker) {
      const track = this._tracker[key];
      if (track.delete || track.update) return true;
    }
    return false;
  }

  /** The submit value for the pageable array */
  get submitValue(): unknown {
    const result: any[] = [];
    const keys = new Set<string>();

    this._elements
      .filter((e) => e.changed && !this.isRowDeleted(e))
      .forEach((e) => {
        const key = this.getPrimaryKey(e);
        if (key) {
          keys.add(key);
          result.push(e.getValue());
        }
      });

    for (let key in this._tracker) {
      if (keys.has(key) || !this._tracker[key].update) continue;
      result.push(this._tracker[key].update);
    }

    return result;
  }

  /** The delete value for the pageable array */
  get deletes(): any[] {
    const primary = (this.type as any).primary || [];
    if (!primary.length) return [];

    const deletes: any[] = [];
    const keys = new Set<string>();

    this._elements
      .filter((e) => this.isRowDeleted(e))
      .forEach((e) => {
        const key = this.getPrimaryKey(e);
        if (key) {
          keys.add(key);
          deletes.push(e.getValue());
        }
      });

    for (let key in this._tracker) {
      if (
        keys.has(key) ||
        !this._tracker[key].delete ||
        !(this._tracker[key].origin || this._tracker[key].update)
      )
        continue;
      deletes.push(this._tracker[key].origin || this._tracker[key].update);
    }

    return deletes;
  }

  /** get the primary key for the pageable array */
  getPrimaryKey(node: DataNode | any): string | undefined {
    const primarys = (this.type as any).primary;
    if (!primarys?.length) return undefined;
    const keys: string[] = [];

    if (node instanceof DataNode) {
      for (let i = 0; i < primarys.length; i++) {
        const k = primarys[i];
        const child = node.getAccessValue(k);
        const v = child?.rawValue;
        if (isNull(v)) return undefined;
        keys.push(`${v}`);
      }
    } else {
      for (let i = 0; i < primarys.length; i++) {
        const k = primarys[i];
        const v = node[k];
        if (isNull(v)) return undefined;
        keys.push(`${v}`);
      }
    }

    return keys.join(".");
  }

  /** Whether the row is deleted */
  isRowDeleted(row: DataNode): boolean {
    const key = this.getPrimaryKey(row);
    return key && this._tracker[key]?.delete ? true : false;
  }

  /** Set the page */
  async setPage(
    page: number,
    count?: number,
    descend?: boolean,
    filter?: { [key: string]: any },
    orderBy?: IAppDataQueryOrder[],
  ) {
    count ||= this.fieldInfo?.take;
    if (isNull(descend)) descend = this.fieldInfo?.descend;

    let appNode = this.parent;
    while (appNode && !(isAppNode(appNode))) appNode = appNode.parent;
    if (!(appNode && isAppNode(appNode) && appNode.target)) return;

    try {
      const res = await queryAppData({
        app: appNode.appType.name,
        target: appNode.target,
        fields: [this.name || ""],
        querys: {
          [this.name || ""]: {
            take: count,
            skip: page * count,
            descend,
            filter,
            orderBy,
          },
        },
      });

      this.fieldInfo = res.infos[this.name || ""];
      const data = res.results[this.name || ""] || [];

      this._elements.forEach((e) => {
        const key = this.getPrimaryKey(e);
        if (!key) return;
        if (e.changed && e.isValid) {
          this._tracker[key] ||= {};
          this._tracker[key].origin = e.original;
          this._tracker[key].update = e.getValue();
        } else if (this._tracker[key]) {
          if (this._tracker[key].delete) {
            this._tracker[key].origin = e.original;
            this._tracker[key].update = undefined;
          } else {
            delete this._tracker[key];
          }
        }
      });

      const elementType = (this.type as any).element;
      for (let i = 0; i < data.length; i++) {
        let eleNode: DataNode | undefined;
        if (this._elements.length <= i) {
          if (!elementType) continue;
          eleNode = elementType.create(data[i], this, this.propertyProvider);
          if (!eleNode) continue;
          this._elements.push(eleNode);
        } else {
          eleNode = this._elements[i];
          eleNode.setValue(data[i]);
          eleNode.confirm();
        }

        const key = this.getPrimaryKey(data[i]);
        if (key && this._tracker[key]?.update) {
          eleNode.setValue(this._tracker[key].update);
        }
      }

      for (let i = this._elements.length - 1; i >= data.length; i--) {
        this._elements.pop()?.dispose();
      }

      this.onNext();
    } catch (ex) {
      throw ex;
    }
  }

  /** Delete the rows */
  override delRows(start: number, count = 1): void {
    if (start < 0 || start >= this._elements.length) return;

    for (let i = start; i < start + count; i++) {
      const ele = this._elements[i];
      const key = this.getPrimaryKey(ele);
      if (key && !this._tracker[key]?.delete) {
        this._tracker[key] ||= {};
        this._tracker[key].delete = true;
        ele.onNextState();
      }
    }
  }

  /** Resume the deleted rows */
  resumeRows(start: number, count = 1): void {
    for (let i = start; i < start + count; i++) {
      const ele = this._elements[i];
      const key = this.getPrimaryKey(ele);
      if (key && this._tracker[key]?.delete) {
        this._tracker[key].delete = undefined;
        ele.onNextState();
      }
    }
  }

  /** Clear the deleted rows */
  clearDeletes(): void {
    for (const key in this._tracker) {
      if (this._tracker[key].delete) {
        delete this._tracker[key];
      }
    }
    this.onNextState();
  }

  /** Confirm the page */
  override confirm(): void {
    this._elements.forEach((e) => e?.confirm());
    this._tracker = {};
    super.confirm();
  }

  /** Reset the page */
  override reset(): void {
    this._elements.forEach((e) => e?.reset());
    this._tracker = {};
    super.reset();
  }

  // #region ── Field Filters ──────────────────────────────────────────────────

  /**
   * Initialize field filters from the Filters property.
   * Creates input nodes for each filter:
   *  - Function filters (FieldFilterMode.Filter): nodes from function args (skip first arg)
   *  - Light filters (other modes): node from the struct field type
   */
  async initFilters(): Promise<void> {
    const filterConfigs = this.getPropertyValue<FieldFilter[]>(Filters);
    if (!filterConfigs?.length) return;

    const elementType = (this.type as ArrayType).element;
    this._appFieldFilter = [];

    for (const f of filterConfigs) {
      if (f.mode === FieldFilterMode.Filter) {
        // Function filter: create input nodes from function args (skip first arg = field type)
        const funcType = getCachedNodeType(f.filter);
        if (funcType instanceof FunctionType && funcType.args.length > 1) {
          const nodes: DataNode[] = [];
          let allValid = true;
          for (let i = 1; i < funcType.args.length; i++) {
            const arg = funcType.args[i];
            const argType = await getNodeType(arg.type) as ValueType | undefined;
            if (!argType || !(argType as any).create) { allValid = false; break; }
            const node = (argType as any).create(undefined, this, this.propertyProvider) as DataNode;
            if (node) {
              node.setPropertyValue<LocaleString>(Display, { key: arg.name });
              nodes.push(node);
            }
          }
          if (allValid && nodes.length) {
            this._appFieldFilter.push({ mode: f.mode, filter: f.filter, nodes });
          }
        }
      } else {
        // Light filter: create input node from the struct field type
        if (elementType instanceof StructType) {
          const field = elementType.getField(f.filter);
          if (field?.type) {
            const node = field.type.create(undefined, this, this.propertyProvider) as DataNode;
            if (node) {
              this._appFieldFilter.push({ mode: f.mode, filter: f.filter, nodes: [node] });
            }
          }
        }
      }
    }
  }

  /**
   * Process the filter from filter nodes.
   * Collects values from filter input nodes and calls setPage with the filter.
   */
  async processFilter(): Promise<void> {
    if (!this._appFieldFilter?.length) return;

    const filter: { [key: string]: any } = {};
    this._appFieldFilter.forEach((f) => {
      if (f.mode === FieldFilterMode.Filter) {
        const funcType = getCachedNodeType(f.filter);
        if (funcType instanceof FunctionType && f.nodes) {
          const args: any[] = [];
          for (let i = 0; i < f.nodes.length; i++) {
            const data = f.nodes[i].rawValue;
            if (isNull(data)) return; // skip this filter if any arg is null
            args.push(data);
          }
          filter[f.filter] = args;
        }
      } else {
        const data = f.nodes && f.nodes.length ? f.nodes[0].rawValue : undefined;
        if (isNull(data)) return;
        filter[f.filter] = data;
      }
    });

    await this.setPage(
      0,
      this.fieldInfo?.take,
      this.fieldInfo?.descend,
      filter,
    );
  }

  /**
   * Reset the filter nodes' values and optionally re-query.
   * @param load Whether to re-query after reset
   */
  async resetFilter(load: boolean = false): Promise<void> {
    if (!this._appFieldFilter?.length) return;

    this._appFieldFilter.forEach((f) => {
      f.nodes?.forEach((n) => n.setValue(null));
    });

    if (load) await this.processFilter();
  }

  /**
   * Enable or disable auto filter when filter nodes change.
   * @param enable Whether to enable auto filter
   * @param delay Debounce delay in ms
   */
  enableAutoFilter(enable: boolean, delay: number = 300): void {
    if (!this._appFieldFilter?.length) return;

    // clear previous handlers
    this._appFieldFilter.forEach((f) => f.handlers?.forEach((h) => h()));

    if (enable) {
      const loadFilter = debounce(() => {
        this.processFilter();
      }, delay);

      this._appFieldFilter.forEach((f) => {
        f.handlers = [];
        f.nodes?.forEach((n) => f.handlers!.push(n.subscribe(loadFilter)));
      });
    }
  }

  // #endregion
}