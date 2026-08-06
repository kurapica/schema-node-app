import { ForSchema, Meta, OfSchema, Property, ReadOnly, SCHEMA_KIND_PROPERTY, SchemaType, Static } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_PROPERTY_APP, SCHEMA_KIND_WORKFLOW } from "../../utils";

/** The workflow node is forkable */
@Meta(ForSchema, SCHEMA_KIND_WORKFLOW)
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY_APP}.workflow.forkable`)
@Meta(Static, true)
@Meta(ReadOnly, true)
export class Forkable extends Property<boolean> {};