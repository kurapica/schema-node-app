import { ArgName, getNodeType, Meta, NS_SYSTEM_BOOL, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, OfNodeKind, Require, Return, SchemaType, ValueType } from "schema-node-core";

import { NODE_KIND_FUNCTION } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_EVENT, NS_SYSTEM_SCHEMA_REFLECT_EVENT } from "../utils/constant";
import type { EventType } from "../schema/event/runtime";

@Meta(SchemaType, NS_SYSTEM_SCHEMA_REFLECT_EVENT)
@Meta(OfNodeKind, NODE_KIND_FUNCTION)
export class SystemReflectEvent
{
  /** Check if the event has arguments */
  @Meta(Return, NS_SYSTEM_BOOL)
  static async hasargs(
    @Meta(ArgName, "event")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.type`)
    @Meta(Require, true)
    event: string
  ): Promise<boolean> {
    if (!event) return false;
    const type = await getNodeType(event) as EventType;
    return type?.args?.length ? true : false;
  }

  /** Checks if the event's payload type match the given type */
  @Meta(Return, NS_SYSTEM_BOOL)
  static async withpayload(
    @Meta(ArgName, 'event')
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_EVENT}.type`)
    @Meta(Require, true)
    event: string,

    @Meta(ArgName, 'type')
    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    type: string
  ): Promise<boolean> {
    if (!type?.length) return true;
    const nodeType = !event ? undefined : await getNodeType(event) as EventType | undefined;
    if (!nodeType?.payload) return false;
    const returnType = !type ? undefined : await getNodeType(type) as ValueType | undefined;
    return !returnType || nodeType.payload.isAssignableTo(returnType);
  }
}
