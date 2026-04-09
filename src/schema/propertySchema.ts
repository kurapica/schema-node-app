import { type SchemaTypeValue } from "../enum/schemaType"
import { type ValueSchemaTypeValue } from "../enum/valueSchemaType"

/**
 * The property schema.
 * Describes a named schema property (e.g. "uplimit", "pattern", "visible", "desc") that applies to
 * specific schema types. Properties can only be registered on the backend or
 * manually registered on the frontend — they cannot be defined in the management UI.
 */
export interface IPropertySchema
{
    /**
     * The property name, such as "uplimit", "lowlimit", "pattern", "visible", "desc", etc.
     */
    property: string

    /**
     * The value type of the property
     */
    valueType?: string

    /**
     * The required property names that this depends on
     */
    depends?: string[]

    /**
     * The optional property names that this depends on
     */
    optionDepends?: string[]

    /**
     * The schema types that this property applies to
     */
    forSchemas?: SchemaTypeValue[]

    /**
     * The value schema type kinds that this property applies to
     */
    forValues?: ValueSchemaTypeValue[]

    /**
     * Include the value type array
     */
    includeArray?: boolean

    /**
     * Whether the property is a constraint property (i.e. participates in validation)
     */
    constraint?: boolean

    /**
     * Whether the property value is a reference to another schema type
     */
    typeref?: boolean

    /**
     * Whether the property is relation-only (computed from relations, not user-settable)
     */
    relationOnly?: boolean

    /**
     * Whether the property is a convert property (used in recognizer parts for format/parse transformations)
     */
    convert?: boolean
}
