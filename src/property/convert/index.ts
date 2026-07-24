import { SchemaType } from "../../enum/schemaType"
import { ValueSchemaType } from "../../enum/valueSchemaType"
import {
    SchemaProperty,
    PropertyDef,
    IConvertProperty,
    ITypeRefProperty,
} from "../propertyBase"
import { type IEntry } from "../../config/scalarConfig"

// ─────────────────────────────────────────────────────────────────────────────
// layout
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Date/time layout string for parsing and emitting (e.g. "yyyy-MM-dd", "HH:mm:ss").
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class LayoutConvertProperty extends SchemaProperty<string> implements IConvertProperty {}
;(LayoutConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// mapping
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inline enum-to-display bidirectional mapping.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class MappingConvertProperty extends SchemaProperty<IEntry[]> implements IConvertProperty {}
;(MappingConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// maxDigits
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maximum number of integer digits (truncated from the left if longer).
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class MaxDigitsConvertProperty extends SchemaProperty<number> implements IConvertProperty {}
;(MaxDigitsConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// padChar
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The padding character (single character string).
 * On parse: strips pad characters from the value.
 * On emit: delegated to minDigits for actual padding.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class PadCharConvertProperty extends SchemaProperty<string> implements IConvertProperty {}
;(PadCharConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// padLeft
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether to pad on the left (true) or the right (false).
 * Works together with minDigits and padChar.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
    optionDepends: ["padChar"],
})
export class PadLeftConvertProperty extends SchemaProperty<boolean> implements IConvertProperty {}
;(PadLeftConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// minDigits
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimum number of integer digits (zero-padded if shorter).
 * Cooperates with padChar and padLeft for the pad character and direction.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
    optionDepends: ["padChar", "padLeft"],
})
export class MinDigitsConvertProperty extends SchemaProperty<number> implements IConvertProperty {}
;(MinDigitsConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// precision
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Number of decimal places for floating-point values.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class PrecisionConvertProperty extends SchemaProperty<number> implements IConvertProperty {}
;(PrecisionConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// toLower
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert the string value to lower case on both parse and emit.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class ToLowerConvertProperty extends SchemaProperty<boolean> implements IConvertProperty {}
;(ToLowerConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// toUpper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert the string value to upper case on both parse and emit.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class ToUpperConvertProperty extends SchemaProperty<boolean> implements IConvertProperty {}
;(ToUpperConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// trim
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Trim leading and trailing whitespace on both parse and emit.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class TrimConvertProperty extends SchemaProperty<boolean> implements IConvertProperty {}
;(TrimConvertProperty.prototype as any).__isConvert = true

// ─────────────────────────────────────────────────────────────────────────────
// parseFunc
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Function that converts a string representation to a typed node value.
 * The value is a function schema name.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class ParseFuncConvertProperty extends SchemaProperty<string>
    implements IConvertProperty, ITypeRefProperty
{
    declare public readonly __isConvert: true
    declare public readonly __isTypeRef: true
}
;(ParseFuncConvertProperty.prototype as any).__isConvert = true
;(ParseFuncConvertProperty.prototype as any).__isTypeRef = true

// ─────────────────────────────────────────────────────────────────────────────
// formatFunc
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Function that converts a typed node value to its string representation.
 * The value is a function schema name.
 * Applies to: RecognizerPart with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.RecognizerPart],
    forValues: [ValueSchemaType.All],
})
export class FormatFuncConvertProperty extends SchemaProperty<string>
    implements IConvertProperty, ITypeRefProperty
{
    declare public readonly __isConvert: true
    declare public readonly __isTypeRef: true
}
;(FormatFuncConvertProperty.prototype as any).__isConvert = true
;(FormatFuncConvertProperty.prototype as any).__isTypeRef = true
