/**
 * The value schema type.
 * Used by property definitions to filter which schema types (or scalar value kinds)
 * a property applies to, mirroring the C# `ValueSchemaType` enum.
 */
export enum ValueSchemaType
{
    /**
     * Applies to all schema types
     */
    All = "all",

    /**
     * Applies to scalar schema types
     */
    Scalar = "scalar",

    /**
     * Applies to enum schema types
     */
    Enum = "enum",

    /**
     * Applies to struct schema types
     */
    Struct = "struct",

    /**
     * Applies to array schema types
     */
    Array = "array",

    /**
     * Applies to json schema types
     */
    Json = "json",

    // Scalar value type refinements

    /**
     * Applies to numeric scalar types
     */
    Number = "number",

    /**
     * Applies to integer scalar types
     */
    Int = "int",

    /**
     * Applies to single-precision floating-point scalar types
     */
    Single = "single",

    /**
     * Applies to double-precision floating-point scalar types
     */
    Double = "double",

    /**
     * Applies to boolean scalar types
     */
    Bool = "bool",

    /**
     * Applies to character scalar types
     */
    Char = "char",

    /**
     * Applies to string scalar types
     */
    String = "string",

    /**
     * Applies to date scalar types
     */
    Date = "date",

    /**
     * Applies to year scalar types
     */
    Year = "year",

    /**
     * Applies to year-month scalar types
     */
    YearMonth = "yearMonth",

    /**
     * Applies to full-date scalar types
     */
    FullDate = "fullDate",

    /**
     * Applies to namespace references used as value types
     */
    Namespace = "namespace",

    // Enum value type refinements

    /**
     * Applies to integer-backed enum types
     */
    IntEnum = "intEnum",

    /**
     * Applies to flags enum types
     */
    FlagsEnum = "flagsEnum",

    /**
     * Applies to string-backed enum types
     */
    StringEnum = "stringEnum",
}

export type ValueSchemaTypeValue = `${ValueSchemaType}`
