/**
 * The type of a recognizer format part.
 */
export enum RecognizerPartType
{
    /**
     * A literal text part
     */
    Literal = "literal",

    /**
     * A field reference part bound to a struct field
     */
    Field = "field",

    /**
     * A self reference part bound to the data itself, used for scalar/enum
     */
    Self = "self",

    /**
     * An element reference part used for array elements
     */
    Elements = "elements",
}

export type RecognizerPartTypeValue = `${RecognizerPartType}`