import { SchemaType } from "../../enum/schemaType"
import { ValueSchemaType } from "../../enum/valueSchemaType"
import {
    SchemaProperty,
    PropertyDef,
    IConstraintProperty,
    ITypeRefProperty,
} from "../propertyBase"
import { type ScalarNode } from "../../node/scalarNode"
import { type EnumNode } from "../../node/enumNode"
import { type StructNode } from "../../node/structNode"
import { type ArrayNode } from "../../node/arrayNode"
import { isNull } from "../../utils/toolset"
import { getEnumAccessList } from "../../utils/schemaProvider"
import { type IPattern, isPatternMatch } from "../patternType"

// ─────────────────────────────────────────────────────────────────────────────
// require
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The node data is required.
 * Applies to: StructField with Scalar | Enum | Array | Struct values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Scalar, ValueSchemaType.Enum, ValueSchemaType.Array, ValueSchemaType.Struct],
})
export class RequireProperty extends SchemaProperty<boolean> implements IConstraintProperty {
    validateScalar(node: ScalarNode, parent?: StructNode): boolean | undefined {
        if (this._value !== true || !parent) return undefined
        return !node.isEmpty
    }
    validateEnum(node: EnumNode, parent?: StructNode): boolean | undefined {
        if (this._value !== true || !parent) return undefined
        return !node.isEmpty
    }
    async validateArray(node: ArrayNode, parent?: StructNode): Promise<boolean | undefined> {
        if (this._value !== true || !parent) return undefined
        return !node.isEmpty
    }
    validateStruct(node: StructNode, parent?: StructNode): boolean | undefined {
        if (this._value !== true || !parent) return undefined
        return !node.isEmpty
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// pattern
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cross-platform pattern validation for string scalars.
 * Applies to: Scalar | StructField with String values; includeArray = true.
 */
@PropertyDef({
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.String],
    includeArray: true,
    optionDepends: ["require"],
})
export class PatternProperty extends SchemaProperty<IPattern[]> implements IConstraintProperty {
    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (node.isEmpty || !this._value?.length) return undefined
        if (!node.isString) return undefined
        const str = `${node.data}`
        return isPatternMatch(str, this._value)
    }

    async validateArray(node: ArrayNode, _parent?: StructNode): Promise<boolean | undefined> {
        if (node.isEmpty || !this._value?.length) return undefined
        for (const item of node.elements) {
            const scalar = item as ScalarNode
            if (!scalar || scalar.isEmpty) continue
            if (!isPatternMatch(`${scalar.data}`, this._value)) return false
        }
        return undefined
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// upLimit
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upper limit for string length.
 * Applies to: Scalar | StructField with String values; includeArray = true.
 */
@PropertyDef({
    name: "upLimit",
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.String],
    includeArray: true,
    optionDepends: ["require"],
})
export class UpLimitStringProperty extends SchemaProperty<number> implements IConstraintProperty {
    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (isNull(this._value) || node.isEmpty || !node.isString) return undefined
        return (`${node.data}`).length <= this._value!
    }
}

/**
 * Upper limit for numeric scalars.
 * Applies to: Scalar | StructField with Number values; includeArray = true.
 */
@PropertyDef({
    name: "upLimit",
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.Number],
    includeArray: true,
    optionDepends: ["require"],
})
export class UpLimitNumberProperty extends SchemaProperty<number> implements IConstraintProperty {
    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (isNull(this._value) || node.isEmpty || !node.isNumber) return undefined
        return (node.data as number) <= this._value!
    }
}

/**
 * Upper limit for date scalars.
 * Applies to: Scalar | StructField with Date values; includeArray = true.
 */
@PropertyDef({
    name: "upLimit",
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.Date],
    includeArray: true,
    optionDepends: ["require"],
})
export class UpLimitDateProperty extends SchemaProperty<string | number> implements IConstraintProperty {
    private _date: Date | undefined

    override setValue(raw: any): void {
        super.setValue(raw)
        if (!isNull(raw)) {
            const d = new Date(raw)
            this._date = isNaN(d.getTime()) ? undefined : d
        }
    }

    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (!this._date || node.isEmpty || !node.isDate) return undefined
        const v = node.data as Date
        return v instanceof Date ? v <= this._date : undefined
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// lowLimit
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lower limit for string length.
 */
@PropertyDef({
    name: "lowLimit",
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.String],
    includeArray: true,
    optionDepends: ["require"],
})
export class LowLimitStringProperty extends SchemaProperty<number> implements IConstraintProperty {
    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (isNull(this._value) || node.isEmpty || !node.isString) return undefined
        return (`${node.data}`).length >= this._value!
    }
}

/**
 * Lower limit for numeric scalars.
 */
@PropertyDef({
    name: "lowLimit",
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.Number],
    includeArray: true,
    optionDepends: ["require"],
})
export class LowLimitNumberProperty extends SchemaProperty<number> implements IConstraintProperty {
    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (isNull(this._value) || node.isEmpty || !node.isNumber) return undefined
        return (node.data as number) >= this._value!
    }
}

/**
 * Lower limit for date scalars.
 */
@PropertyDef({
    name: "lowLimit",
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.Date],
    includeArray: true,
    optionDepends: ["require"],
})
export class LowLimitDateProperty extends SchemaProperty<string | number> implements IConstraintProperty {
    private _date: Date | undefined

    override setValue(raw: any): void {
        super.setValue(raw)
        if (!isNull(raw)) {
            const d = new Date(raw)
            this._date = isNaN(d.getTime()) ? undefined : d
        }
    }

    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (!this._date || node.isEmpty || !node.isDate) return undefined
        const v = node.data as Date
        return v instanceof Date ? v >= this._date : undefined
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// whiteList
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Only allow values present in this list.
 * Applies to: StructField with Scalar | Enum values; includeArray = true.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Scalar, ValueSchemaType.Enum],
    includeArray: true,
    optionDepends: ["require"],
})
export class WhiteListProperty extends SchemaProperty<any[]> implements IConstraintProperty {
    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (!this._value?.length || node.isEmpty) return undefined
        const v = `${node.data}`
        return this._value.some(item => `${item}` === v || (item !== null && typeof item === "object" && `${item.value}` === v))
    }
    validateEnum(node: EnumNode, _parent?: StructNode): boolean | undefined {
        if (!this._value?.length || node.isEmpty) return undefined
        const v = `${node.data}`
        return this._value.some(item => `${item}` === v || (item !== null && typeof item === "object" && `${item.value}` === v))
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// blackList
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reject values present in this list.
 * Applies to: StructField with Scalar | Enum values; includeArray = true.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Scalar, ValueSchemaType.Enum],
    includeArray: true,
    optionDepends: ["require"],
})
export class BlackListProperty extends SchemaProperty<any[]> implements IConstraintProperty {
    validateScalar(node: ScalarNode, _parent?: StructNode): boolean | undefined {
        if (!this._value?.length || node.isEmpty) return undefined
        const v = `${node.data}`
        return this._value.every(item => `${item}` !== v && (item === null || typeof item !== "object" || `${item.value}` !== v))
    }
    validateEnum(node: EnumNode, _parent?: StructNode): boolean | undefined {
        if (!this._value?.length || node.isEmpty) return undefined
        const v = `${node.data}`
        return this._value.every(item => `${item}` !== v && (item === null || typeof item !== "object" || `${item.value}` !== v))
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// type
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Defines the expected schema type of the field value (used for relationship type checking).
 * Applies to: StructField | AppField with All values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField, SchemaType.AppField],
    forValues: [ValueSchemaType.All],
})
export class TypeProperty extends SchemaProperty<string> implements IConstraintProperty {}

// ─────────────────────────────────────────────────────────────────────────────
// validate
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom validation function reference for scalar values.
 * Applies to: Scalar | StructField with String | Number | Date values.
 * The value is a function schema name that returns boolean.
 */
@PropertyDef({
    forSchemas: [SchemaType.Scalar, SchemaType.StructField],
    forValues: [ValueSchemaType.String, ValueSchemaType.Number, ValueSchemaType.Date],
    includeArray: true,
    optionDepends: ["require"],
})
export class ValidateProperty extends SchemaProperty<string>
    implements IConstraintProperty, ITypeRefProperty
{
    // ITypeRefProperty marker
    declare public readonly __isTypeRef: true

    async validateScalarAsync(node: ScalarNode, _parent?: StructNode): Promise<boolean | undefined> {
        if (isNull(this._value) || node.isEmpty) return undefined
        const { callSchemaFunction } = await import("../../utils/schemaProvider")
        try {
            const result = await callSchemaFunction(this._value!, [node.data])
            return result === true || result === false ? result : undefined
        } catch {
            return false
        }
    }
}

// Attach marker on prototype
;(ValidateProperty.prototype as any).__isTypeRef = true

// ─────────────────────────────────────────────────────────────────────────────
// cascade
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Limit the cascade level of an enum field.
 * Applies to: StructField with Enum values; includeArray = true.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Enum],
    includeArray: true,
    optionDepends: ["require"],
})
export class CascadeProperty extends SchemaProperty<number> implements IConstraintProperty {
    async validateEnumAsync(node: EnumNode, _parent?: StructNode): Promise<boolean | undefined> {
        if (!this._value || this._value <= 0 || node.isEmpty) return undefined
        const access = await getEnumAccessList(node.schemaName, node.data)
        if (!access?.length) return undefined
        return access.length <= this._value
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// leafOnly
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Only allow leaf-level (no children) enum values.
 * Applies to: StructField with Enum values; includeArray = true.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Enum],
    includeArray: true,
    optionDepends: ["require"],
})
export class LeafOnlyProperty extends SchemaProperty<boolean> implements IConstraintProperty {
    async validateEnumAsync(node: EnumNode, _parent?: StructNode): Promise<boolean | undefined> {
        if (this._value !== true || node.isEmpty) return undefined
        const { getEnumSubList } = await import("../../utils/schemaProvider")
        const subList = await getEnumSubList(node.schemaName, node.data)
        return !subList?.length
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// singleFlag
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Disallow flags enum value combinations — only a single bit may be set.
 * Applies to: StructField with FlagsEnum values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.FlagsEnum],
    optionDepends: ["require"],
})
export class SingleFlagProperty extends SchemaProperty<boolean> implements IConstraintProperty {
    validateEnum(node: EnumNode, _parent?: StructNode): boolean | undefined {
        if (this._value !== true || node.isEmpty) return undefined
        const val = node.data as number
        if (typeof val !== "number") return undefined
        return val !== 0 && (val & (val - 1)) === 0
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// root
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Restrict the enum value to be a descendant of the specified root value.
 * Applies to: StructField with Enum | Namespace values.
 */
@PropertyDef({
    forSchemas: [SchemaType.StructField],
    forValues: [ValueSchemaType.Enum, ValueSchemaType.Namespace],
    optionDepends: ["require"],
})
export class RootProperty extends SchemaProperty<any> implements IConstraintProperty {
    async validateEnumAsync(node: EnumNode, _parent?: StructNode): Promise<boolean | undefined> {
        if (isNull(this._value) || node.isEmpty) return undefined
        const root = `${this._value}`
        const nodeVal = `${node.data}`
        if (root === nodeVal) return true
        const access = await getEnumAccessList(node.schemaName, nodeVal)
        return access?.some(a => `${a.value}` === root) ?? undefined
    }
}
