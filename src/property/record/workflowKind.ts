import { Alias, Meta, OfNodeKind, PropertyValueType, RecordProperty, NODE_KIND_ENUM, SchemaType } from "schema-node-core";

import { NS_SYSTEM_STRING } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_WORKFLOW } from "../../utils/constant";

@Meta(Alias, 'workflowKind')
@Meta(OfNodeKind, NODE_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.kind`)
@Meta(PropertyValueType, NS_SYSTEM_STRING)
export class WorkflowKind extends RecordProperty<string> {}