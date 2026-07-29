import { ArrayNode, DataNode, isNull, isEqual, deepClone } from "schema-node-core";
import { IAppDataFieldInfo, IAppDataQueryOrder } from "../schema/provider/interface";
import { AppNode } from "./appNode";
import { queryAppData } from "../schema/provider/appSchemaProvider";

/** The pageable array data node */
export class PageNode extends ArrayNode {
  fieldInfo: IAppDataFieldInfo | undefined;

  private _tracker: {
    [key: string]: { origin?: {}; update?: {}; delete?: boolean };
  } = {};

  get page(): number {
    return this.fieldInfo?.take
      ? Math.floor((this.fieldInfo.skip || 0) / this.fieldInfo.take)
      : 0;
  }

  get pageCount() {
    return this.fieldInfo?.take;
  }

  get total() {
    return this.fieldInfo?.total ?? this.length;
  }

  get query() {
    return this.fieldInfo?.filter ? { ...this.fieldInfo.filter } : undefined;
  }

  get orderBy(): IAppDataQueryOrder[] {
    return deepClone(this.fieldInfo?.orderBy) || [];
  }

  get changed(): boolean {
    if (this._elements.some((e) => e.changed)) return true;
    for (let key in this._tracker) {
      const track = this._tracker[key];
      if (track.delete || track.update) return true;
    }
    return false;
  }

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

  isRowDeleted(row: DataNode): boolean {
    const key = this.getPrimaryKey(row);
    return key && this._tracker[key]?.delete ? true : false;
  }

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
    while (appNode && !(appNode instanceof AppNode)) appNode = appNode.parent;
    if (!(appNode && appNode instanceof AppNode && appNode.target)) return;

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

  delRows(start: number, count = 1): void {
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

  clearDeletes(): void {
    for (const key in this._tracker) {
      if (this._tracker[key].delete) {
        delete this._tracker[key];
      }
    }
    this.onNextState();
  }

  override confirm(): void {
    this._elements.forEach((e) => e?.confirm());
    this._tracker = {};
    super.confirm();
  }

  override reset(): void {
    this._elements.forEach((e) => e?.reset());
    this._tracker = {};
    super.reset();
  }
}