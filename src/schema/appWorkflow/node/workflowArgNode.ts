import { StructNode, type IValueTypeAccess, type IValueAccess, type IPropertyProvider, DataNode, FuncArgType } from "schema-node-core";

/** Workflow argument node */
export class WorkflowArgNode extends StructNode {
  constructor(type: IValueTypeAccess, value: unknown, parent?: IValueAccess, ...propProviders: IPropertyProvider[]) {
    super(type, value, parent, ...propProviders);

    const valueNode = this.getAccessValue('value') as DataNode;
    valueNode.addPropertyProvider(propProviders.find(provider => provider instanceof FuncArgType));
  }
}