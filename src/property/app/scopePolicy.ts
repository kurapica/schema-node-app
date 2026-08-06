import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, NS_SYSTEM_STRING, NS_SYSTEM_IDENTIFIER, PrimaryIndex, PropertyValueType, EntrySource, buildFuncCall, NS_SYSTEM_SCHEMA_REFLECT_TYPE, NS_SYSTEM_CONTEXT, ENTRY_ROOT, NODE_SELF, Require, Default, Relation, Call, NS_SYSTEM_LOGIC_EQ, Visible } from "schema-node-core";
import { SCHEMA_KIND_APP, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_APP } from "../../utils/constant";
import { AppScopeType } from "../../enum/appScopeType";

export interface AppScopeContextMap {
    contextItem: string;
    mapKey?: string;
}

export interface AppScopePolicy {
    type: AppScopeType;
    contextMaps?: AppScopeContextMap[];
}

@Meta(ForSchema, [SCHEMA_KIND_APP])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.scopePolicy`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_APP}.ScopePolicy`)
export class ScopePolicy extends Property<AppScopePolicy> {
    override setValue<TValue>(value: TValue): void {
        if (typeof value === 'string') {
            super.setValue({ type: value as AppScopeType });
        } else {
            super.setValue(value as unknown as AppScopePolicy);
        }
    }
}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.ScopeContextMap`)
class AppScopeContextMapMeta implements AppScopeContextMap {
    @Meta(SchemaType, NS_SYSTEM_STRING)
    @Meta(PrimaryIndex, 0)
    @Meta(EntrySource, buildFuncCall(`${NS_SYSTEM_SCHEMA_REFLECT_TYPE}.getaccessentries`, NS_SYSTEM_CONTEXT, NODE_SELF, ENTRY_ROOT))
    contextItem: string;

    @Meta(SchemaType, NS_SYSTEM_IDENTIFIER)
    mapKey?: string;
}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.ScopePolicy`)
class AppScopePolicyMeta implements AppScopePolicy {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.scope`)
    @Meta(Require, true)
    @Meta(Default, AppScopeType.BusinessTarget)
    type: AppScopeType;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.ScopeContextMaps`)
    @Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@type', AppScopeType.IsolationContext))
    contextMaps?: AppScopeContextMap[];
}