import { Meta, ForSchema, OfSchema, SchemaType, Property, SCHEMA_KIND_PROPERTY, NS_SYSTEM_SCHEMA_PROPERTY } from "schema-node-core";
import { SCHEMA_KIND_EVENT } from "../../utils/constant";

@Meta(ForSchema, [SCHEMA_KIND_EVENT])
@Meta(OfSchema, SCHEMA_KIND_PROPERTY)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_PROPERTY}.event.payloadEvaluator`)
export class PayloadEvaluator extends Property<string> {}