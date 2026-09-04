import { buildFuncCall, Call, ForSchema, Meta, OfSchema, Property, PropertyValueType, ReadOnly, Relation, SCHEMA_KIND_NODE, SchemaType, Static, Visible } from "schema-node-core";

import type { WorkflowSchema } from "./type";

import { NS_SYSTEM_BOOL, NS_SYSTEM_LOGIC_EQ, NS_SYSTEM_SCHEMA_PRO, NS_SYSTEM_SCHEMA_PRO_CORE, SCHEMA_KIND_PROPERTY } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_WORKFLOW, SCHEMA_KIND_WORKFLOW } from "../../utils/constant";

/** The workflow property for node schema */
@Meta(ForSchema, [SCHEMA_KIND_NODE])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO_CORE}.workflow`)
@Meta(PropertyValueType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.schema`)
@Meta(ReadOnly, true) // only system workflow allowed
@Relation(Visible, Call, buildFuncCall(NS_SYSTEM_LOGIC_EQ, '@kind', SCHEMA_KIND_WORKFLOW))
export class WorkflowProperty extends Property<WorkflowSchema> {}

/** Allow the workflow to fork */
@Meta(ForSchema, SCHEMA_KIND_WORKFLOW)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PRO}.workflow.forkable`)
@Meta(PropertyValueType, NS_SYSTEM_BOOL)
@Meta(Static, true)
@Meta(ReadOnly, true)
export class Forkable extends Property<boolean> {};
