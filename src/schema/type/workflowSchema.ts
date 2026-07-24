import { Attach, Base, buildFuncCall, Call, ForSchema, FuncArg, Meta, NODE_SELF, NodeSchemaKind, NS_SYSTEM_LOGIC_EQ, NS_SYSTEM_SCHEMA_FUNC, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE, NS_SYSTEM_SCHEMA_PROPERTY_CORE, NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, OfSchema, Property, PropertyValueType, ReadOnly, Relation, Require, RuntimeNodeType, SCHEMA_KIND_PROPERTY, SCHEMA_KIND_STRING, SchemaKind, SchemaType, Valid, Visible } from "schema-node-core";
import { SCHEMA_KIND_WORKFLOW, SCHEMA_KIND_ORDER_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW } from "../../utils/constant";
import { WorkflowType } from "../../runtime/workflowType";

export interface WorkflowSchema {
    /** The workflow schema kind */
    kind: string;

    /** The workflow payload schema type */
    payload?: string;

    /** The workflow settings schema type for creation */
    settings?: string;

    /** The workflow session schema type for processing */
    session?: string;

    /** The workflow arguments */
    args?: FuncArg[];
}

@Meta(SchemaKind, [SCHEMA_KIND_WORKFLOW, SCHEMA_KIND_ORDER_WORKFLOW])
@Meta(NodeSchemaKind, SCHEMA_KIND_WORKFLOW)
@Meta(RuntimeNodeType, WorkflowType)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.schema`)
@Meta(Attach, SCHEMA_KIND_WORKFLOW)
class WorkflowSchemaMeta implements WorkflowSchema {
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.kind`)
    @Meta(Require, true)
    kind: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    payload?: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    settings?: string;

    @Meta(SchemaType, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
    session?: string;

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_FUNC}.args`)
    args?: FuncArg[];
}

/** The workflow property for node schema */
@Meta(ForSchema, [SCHEMA_KIND_WORKFLOW])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_CORE}.workflow`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.schema`)
@Meta(ReadOnly, true) // only system workflow allowed
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@kind', SCHEMA_KIND_WORKFLOW))
export class WorkflowProperty extends Property<WorkflowSchema> {}

@Meta(OfSchema, SCHEMA_KIND_STRING)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
@Meta(Base, NS_SYSTEM_SCHEMA_NODE_VALUE_TYPE)
@Meta(Valid, buildFuncCall(NS_SYSTEM_SCHEMA_REFLECT_IS_SCHEMA_KIND, NODE_SELF, SCHEMA_KIND_WORKFLOW))
class WorkflowTypeMeta {}