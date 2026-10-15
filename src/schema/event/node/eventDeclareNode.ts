import { StructNode, StringNode, StructType, type FuncExp, type IValueAccess, type IPropertyProvider, getNodeType } from "schema-node-core";
import type { EventDeclareArgsNode } from "./eventDeclareArgsNode";
import type { EventType } from "../runtime";

/** The expression node contains the expression definition, used to apply the relations from the function argument */
export class EventDeclareNode extends StructNode
{
  // #region ── ctor & dtor ───────────────────────────────────────────────────

  /** The event */
  readonly event: StringNode;

  /** The arguments */
  readonly args: EventDeclareArgsNode;

  constructor(type: StructType, value: FuncExp | undefined, parent?: IValueAccess, ...propProviders: IPropertyProvider[]) {
    super(type, value, parent, ...propProviders);
    this.event = this.getAccessValue("event") as StringNode;
    this.args = this.getAccessValue("args") as EventDeclareArgsNode;

    this.recordSubscription(this.event.subscribe(this.refreshExpArgs, true));
  }

  // #endregion

  // #endregion

  // #region ── Utility ─────────────────────────────────────────────────────────

  private refreshExpArgs = async () => {
    const event = this.event.value as string;
    const eventType = event ? await getNodeType(event) as EventType : undefined;
    this.args.refreshEvent(eventType);
  }

  //#endregion
}