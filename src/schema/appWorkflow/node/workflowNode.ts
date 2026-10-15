import { StructNode,  StringNode,  StructType, type FuncExp, type IValueAccess, type IPropertyProvider, getNodeType, FunctionType } from "schema-node-core";
import type { WorkflowArgsNode } from "./workflowArgsNode";
import type { WorkflowType } from "../../workflow/runtime";

/** The expression node contains the expression definition, used to apply the relations from the function argument */
export class WorkflowNode extends StructNode
{
  // #region ── ctor & dtor ───────────────────────────────────────────────────

  /** The workflow */
  readonly workflow: StringNode;

  /** The arguments */
  readonly args: WorkflowArgsNode;

  constructor(type: StructType, value: FuncExp | undefined, parent?: IValueAccess, ...propProviders: IPropertyProvider[]) {
    super(type, value, parent, ...propProviders);
    this.workflow = this.getAccessValue("type") as StringNode;
    this.args = this.getAccessValue("args") as WorkflowArgsNode;

    this.recordSubscription(this.workflow.subscribe(this.refreshExpArgs, true));
  }

  // #endregion

  // #endregion

  // #region ── Utility ─────────────────────────────────────────────────────────

  private refreshExpArgs = async () => {
    const workflow = this.workflow.value as string;
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    this.args.refreshWorkflow(workflowType);
  }

  //#endregion
}