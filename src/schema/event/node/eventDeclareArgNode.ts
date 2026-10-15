import { StructNode, type IValueTypeAccess, type IValueAccess, type IPropertyProvider, DataNode, FuncArgType } from "schema-node-core";

/** Function call argument node */
export class EventDeclareArgNode extends StructNode {
  constructor(type: IValueTypeAccess, value: unknown, parent?: IValueAccess, ...propProviders: IPropertyProvider[]) {
    super(type, value, parent, ...propProviders);

    const valueNode = this.getAccessValue('value') as DataNode;
    valueNode.addPropertyProvider(propProviders.find(provider => provider instanceof FuncArgType));
  }
}