import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_NODE } from "schema-node-core";
import { SCHEMA_KIND_APP, SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_APP_WORKFLOW, NS_SYSTEM_SCHEMA_PROPERTY_APP, NS_SYSTEM_SCHEMA_APP } from "../../utils/constant";
import { PolicyCombine } from "../../enum/policyCombine";
import { PolicyScope } from "../../enum/policyScope";

export interface PolicyItem {
    scope: PolicyScope;
    evaluator: string;
    combine: PolicyCombine;
}

@Meta(ForSchema, [SCHEMA_KIND_NODE, SCHEMA_KIND_APP, SCHEMA_KIND_APP_FIELD, SCHEMA_KIND_APP_WORKFLOW])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.auths`)
export class Auths extends Property<PolicyItem[]> {}