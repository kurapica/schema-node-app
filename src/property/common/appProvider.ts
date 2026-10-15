import { Meta, Alias, OfNodeKind, NODE_KIND_PROPERTY, SchemaType, Static, ReadOnly, InVisible, PropertyValueType, NS_SYSTEM_STRING, Property, ForSchema, SCHEMA_KIND_NODE_STRUCT, AccessPathHandler, type IAccessPathHandler, type IValueTypeAccess, getNodeType, type IValueAccess } from "schema-node-core";
import { APP_PROVIDER, NS_SYSTEM_SCHEMA_APP, NS_SYSTEM_SCHEMA_PRO_APP } from "../../utils/constant";

/** The app provider property. */
@Meta(Alias, 'appProvider')
@Meta(ForSchema, [SCHEMA_KIND_NODE_STRUCT])
@Meta(OfNodeKind, NODE_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_APP}.appprovider`)
@Meta(Static, true)
@Meta(ReadOnly, true)
@Meta(InVisible, true)
@Meta(PropertyValueType, NS_SYSTEM_STRING)
export class AppProvider extends Property<string>{}


@Meta(AccessPathHandler, APP_PROVIDER)
class AppProviderAccessPath implements IAccessPathHandler {
  private _valueType: IValueTypeAccess | undefined

  constructor() {
    setTimeout(async() => {
      // not really used, keep simple
      this._valueType = await getNodeType(`${NS_SYSTEM_SCHEMA_APP}.type`) as any as IValueTypeAccess;
    }, 0)
  }

  /** Get the access value type from the owner by path. */
  getAccessValueType(owner: IValueTypeAccess): IValueTypeAccess | undefined {
    return this._valueType;
  }

  /** Get the access value from the owner by path. */
  getAccessValue(owner: IValueAccess, node?: IValueAccess): IValueAccess | undefined {
    let access: IValueAccess | undefined = node ?? owner;
    while (access && !access.getProperty(AppProvider)?.hasValue) access = access.parent;
    if (access) return access.getAccessValue(access.getPropertyValue<string>(AppProvider)!, node);
  }
}