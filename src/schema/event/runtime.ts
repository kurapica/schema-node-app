import { NodeType, ValueType, FunctionType, type IProperty, getPropertiesBySchemaKind, getNodeType, type INodeType } from "schema-node-core";
import type { EventSchema } from "./type";
import { SCHEMA_KIND_EVENT } from "../../utils/constant";
import { PayloadEvaluator } from "./property";

export class EventType extends NodeType {
  private _eventSchema?: EventSchema;

  get payload(): ValueType | undefined { return this._payload; }
  private _payload?: ValueType;

  get payloadEvaluator(): FunctionType | undefined { return this._payloadEvaluator; }
  private _payloadEvaluator?: FunctionType;

  get args(): { name: string; type: string }[] | undefined { return this._eventSchema?.args; }

  get isUsed(): boolean { return true; }

  override loadProperties(): IProperty[] {
    this._eventSchema = this.getProperty("event")?.getValue();
    return this._eventSchema ? Array.from(getPropertiesBySchemaKind(this._eventSchema, SCHEMA_KIND_EVENT)) : [];
  }

  override async load() {
    if (this._eventSchema?.payload)
      this._payload = await getNodeType(this._eventSchema.payload, this.generics, this.genericParams) as ValueType;

    const payloadEvaluator = this.getProperty(PayloadEvaluator)?.getValue<string>();
    if (payloadEvaluator) {
      this._payloadEvaluator = await getNodeType(payloadEvaluator) as FunctionType;
    }
  }

  unload(): void {
    this._payload = undefined;
    this._payloadEvaluator = undefined;
  }

  *getRefTypes(): Generator<INodeType> {
    if (this._payload) yield this._payload;
    if (this._payloadEvaluator) yield this._payloadEvaluator;
    yield* super.getRefTypes();
  }
}
