import { type RecognizerPartTypeValue } from "../enum/RecognizerPartType"

/**
 * A single part of the recognizer format template.
 * Convert properties (layout, mapping, minDigits, maxDigits, precision,
 * padChar, padLeft, trim, toUpper, toLower, parseFunc, formatFunc) are stored
 * as extension data entries on this object, resolved at runtime by the
 * IConvertProperty system.
 */
export interface IRecognizerPart
{
    /**
     * The part type: Literal, Field, Self, or Elements
     */
    type: RecognizerPartTypeValue

    /**
     * Literal: the text to match/emit
     */
    text?: string

    /**
     * Field: the struct field name this part binds to
     */
    field?: string

    /**
     * Elements: the delimiter between array elements
     */
    delimiter?: string

    /**
     * A nested recognizer for this part
     */
    recognizer?: string

    /**
     * Extension data — holds serialized IConvertProperty key/value pairs
     * (e.g. layout, mapping, minDigits, maxDigits, precision, padChar, padLeft,
     * trim, toUpper, toLower, parseFunc, formatFunc).
     */
    [key: string]: unknown
}

/**
 * The recognizer schema.
 * Declares a string representation (format) for a known source type,
 * supporting both parsing (string → type) and emitting (type → string).
 */
export interface IRecognizerSchema
{
    /**
     * The source type this recognizer describes.
     * Must be a known value type: Scalar, Enum, Struct, or Array.
     */
    sourceType: string

    /**
     * The structured format parts that define the string representation.
     */
    parts: IRecognizerPart[]
}

