import { Meta, SchemaType, OfSchema, SCHEMA_KIND_FUNCTION, getNodeType, Require, NS_SYSTEM_BOOL, Return } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW } from "../utils";
import { WorkflowType } from "../schema/workflow/runtime";
import { Forkable } from "../schema/workflow/property";

@Meta(SchemaType, NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW)
@Meta(OfSchema, SCHEMA_KIND_FUNCTION)
export class SystemReflectWorkflow
{
  /** Whether the workflow kind is the same */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.iskind`)
  @Meta(Return, NS_SYSTEM_BOOL)
  static async iskind(
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string,

    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.kind`)
    @Meta(Require, true)
    kind: string
  ): Promise<boolean>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return workflowType?.kind === kind;
  }

  /** Whether the workflow has args */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.hasargs`)
  @Meta(Return, NS_SYSTEM_BOOL)
  static async hasargs(
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string
  ): Promise<boolean>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return !!workflowType?.args?.length;
  }

  /** Whether the workflow is forkable */
  @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW}.isforkable`)
  @Meta(Return, NS_SYSTEM_BOOL)
  static async isforkable(
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string
  ): Promise<boolean>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return workflowType?.getProperty(Forkable)?.getValue<boolean>() ?? false;
  }
}