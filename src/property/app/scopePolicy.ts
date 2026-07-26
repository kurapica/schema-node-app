import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY } from "schema-node-core";
import { SCHEMA_KIND_APP, NS_SYSTEM_SCHEMA_PROPERTY_APP } from "../../utils/constant";
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
export class ScopePolicy extends Property<AppScopePolicy> {
    override setValue<TValue>(value: TValue): void {
        if (typeof value === 'string') {
            super.setValue({ type: value as AppScopeType });
        } else {
            super.setValue(value as unknown as AppScopePolicy);
        }
    }
}