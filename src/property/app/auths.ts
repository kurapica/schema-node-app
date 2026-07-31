import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_NODE, NS_SYSTEM_SCHEMA_FUNC_TYPE, Base, buildFuncCall, NODE_SELF, NS_SYSTEM_BOOL, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_RETURN, SCHEMA_KIND_STRING, Valid, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NS_SYSTEM_LIST, PropertyValueType } from "schema-node-core";
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
@Meta(PropertyValueType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_SCHEMA_APP}.policy.item>`)
export class Auths extends Property<PolicyItem[]> {}

/** Represents the validation function type */
@Meta(OfSchema, SCHEMA_KIND_STRING)
@Meta(Base, `${NS_SYSTEM_SCHEMA_FUNC}.valid`)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.evaluator`)
@Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_FUNC_WITH_ARGS, NODE_SELF))
class EvaluatorTypeMeta {}

@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.item`)
class PolicyItemMeta implements PolicyItem {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.scope`)
    scope: PolicyScope;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.evaluator`)
    evaluator: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP}.policy.combine`)
    combine: PolicyCombine;
}