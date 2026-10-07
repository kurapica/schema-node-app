import { Alias, Meta, Property } from "schema-node-core";

/** The deleted property */
@Meta(Alias, 'deleted')
export class Deleted extends Property<boolean>{}