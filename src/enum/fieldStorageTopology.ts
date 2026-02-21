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