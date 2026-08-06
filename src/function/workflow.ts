import { Meta, SchemaType, OfSchema, SCHEMA_KIND_FUNCTION, getNodeType, Require } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW } from "../utils";
import { WorkflowType } from "../runtime";

@Meta(SchemaType, NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW)
@Meta(OfSchema, SCHEMA_KIND_FUNCTION)
export class SystemReflectWorkflow
{
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
}