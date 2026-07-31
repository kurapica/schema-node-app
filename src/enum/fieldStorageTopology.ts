import { Meta, OfSchema, SCHEMA_KIND_ENUM, SchemaType, FromEnum } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP_FIELD } from "../utils";

/**
 * The topology of field storage, which determines how the data of dynamic type fields is stored in the database.
 */
export enum FieldStorageTopology {
    /// <summary>
    /// All data saved in the same table, which is the default topology.
    /// </summary>
    CoLocated = "coLocated",
    
    /// <summary>
    /// The dynamic type field data will be saved as key-value pairs in a separate table,
    /// which is more flexible and can support more complex data structures.
    /// </summary>
    AttributeBased  = "attributeBased",
}

export type FieldStorageTopologyValue = `${FieldStorageTopology}`

/** The schema declaration */
@Meta(OfSchema, SCHEMA_KIND_ENUM)
@Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_FIELD}.topology`)
@Meta(FromEnum, FieldStorageTopology)
class FieldStorageTopologyMeta {}