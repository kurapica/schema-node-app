import { Meta, OfSchema, PropertyValueType, RecordProperty, SchemaType } from "schema-node-core";

import { NS_SYSTEM_STRING, SCHEMA_KIND_PROPERTY } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_WORKFLOW } from "../../utils";

@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.kind`)
@Meta(PropertyValueType, NS_SYSTEM_STRING)
export class WorkflowKind extends RecordProperty<string> {}