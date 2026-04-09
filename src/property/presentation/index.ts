import { SchemaType } from "../../enum/schemaType"
import { ValueSchemaType } from "../../enum/valueSchemaType"
import { SchemaProperty, PropertyDef, IRelationOnlyProperty } from "../propertyBase"
import { type ILocaleString } from "../../utils/locale"

// ─────────────────────────────────────────────────────────────────────────────
// default
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Default value for a schema node.
 * Applies to: Scalar | Enum | StructField with Bool | String | Number | Date | Enum values; includeArray = true.
 */
@PropertyDef({
    forSchemas: [SchemaType.Scalar, SchemaType.Enum, SchemaType.StructField],
    forValues: [ValueSchemaType.Bool, ValueSchemaType.String, ValueSchemaType.Number, ValueSchemaType.Date, ValueSchemaType.Enum],
    includeArray: true,
})
export class DefaultProperty extends SchemaProperty<any> {}

// ─────────────────────────────────────────────────────────────────────────────
// desc
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Description / documentation for a schema node.
 * Applies to: StructField | App | AppField | AppWorkflow with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField, SchemaType.App, SchemaType.AppField, SchemaType.AppWorkflow],
    forValues: [ValueSchemaType.All],
})
export class DescProperty extends SchemaProperty<ILocaleString | string> {}

// ─────────────────────────────────────────────────────────────────────────────
// error
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom error message when validation fails.
 * Applies to: Scalar | StructField with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.All],
})
export class ErrorProperty extends SchemaProperty<ILocaleString | string> {}

// ─────────────────────────────────────────────────────────────────────────────
// immutable
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Node data is immutable — cannot be changed once initialized.
 * Applies to: StructField with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.All],
})
export class ImmutableProperty extends SchemaProperty<boolean> {}

// ─────────────────────────────────────────────────────────────────────────────
// readonly
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Node data is readonly — always read-only regardless of state.
 * Applies to: StructField with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.All],
})
export class ReadonlyProperty extends SchemaProperty<boolean> {}

// ─────────────────────────────────────────────────────────────────────────────
// displayOnly
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Node is display-only — shown but will not be submitted or saved.
 * Applies to: StructField with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.All],
})
export class DisplayOnlyProperty extends SchemaProperty<boolean> {}

// ─────────────────────────────────────────────────────────────────────────────
// invisible
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Node is statically invisible (always hidden).
 * Applies to: StructField with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.All],
})
export class InvisibleProperty extends SchemaProperty<boolean> {}

// ─────────────────────────────────────────────────────────────────────────────
// visible
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dynamically computed visibility (relation-only — not user-settable).
 * Applies to: StructField with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.All],
})
export class VisibleProperty extends SchemaProperty<boolean> implements IRelationOnlyProperty {}

// Attach marker on prototype
;(VisibleProperty.prototype as any).__isRelationOnly = true

// ─────────────────────────────────────────────────────────────────────────────
// unit
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Unit of a numeric field, e.g. "ms", "kg", "m/s".
 * Applies to: Scalar | StructField with Number values.
 */
@PropertyDef({
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.Number],
})
export class UnitProperty extends SchemaProperty<ILocaleString | string> {}

// ─────────────────────────────────────────────────────────────────────────────
// unpack
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Unpack/pack additional data for a JSON-typed struct field.
 * Applies to: StructField with Json values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Json],
})
export class UnpackProperty extends SchemaProperty<boolean> {}

// ─────────────────────────────────────────────────────────────────────────────
// stackUpLimit
// ─────────────────────────────────────────────────────────────────────────────

/**
 * When calculating the upper limit, add the original value to the limit.
 * Applies to: StructField with Number values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Number],
})
export class StackUpLimitProperty extends SchemaProperty<boolean> {}
