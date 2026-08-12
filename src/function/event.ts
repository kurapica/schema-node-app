import { Meta, NS_SYSTEM_SCHEMA, NS_SYSTEM_STRING, OfSchema, Require, Return, SCHEMA_KIND_FUNCTION, SchemaType } from "schema-node-core";
import { NS_SYSTEM_EVENT, NS_SYSTEM_SCHEMA_REFLECT_EVENT } from "../utils";
import { SystemReflectApp } from "./app";

@Meta(SchemaType, NS_SYSTEM_SCHEMA_REFLECT_EVENT)
@Meta(OfSchema, SCHEMA_KIND_FUNCTION)
export class SystemReflectEvent
{
  /** Get app field data change event payload type */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_EVENT}.getappfieldpayload`)
  @Meta(Return, NS_SYSTEM_STRING)
  static async getappfieldpayload(
    @Meta(SchemaType, NS_SYSTEM_SCHEMA)
    @Meta(Require, true)
    app: string,

    @Meta(SchemaType, NS_SYSTEM_SCHEMA)
    @Meta(Require, true)
    field: string
  ): Promise<string | undefined> {
    return await SystemReflectApp.getappfieldtype(app, field, true);
  }

  /** Get app field data change event payload type */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_EVENT}.getappfieldupdatepayload`)
  @Meta(Return, NS_SYSTEM_STRING)
  static async getappfieldupdatepayload(
    @Meta(SchemaType, NS_SYSTEM_SCHEMA)
    @Meta(Require, true)
    app: string,

    @Meta(SchemaType, NS_SYSTEM_SCHEMA)
    @Meta(Require, true)
    field: string
  ): Promise<string | undefined> {
    const item = await SystemReflectApp.getappfieldtype(app, field, true);
    return item ? `${NS_SYSTEM_EVENT}.app.data.updatepayload<${item}>` : undefined;
  }
}
