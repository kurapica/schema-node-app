import { type SchemaTypeValue } from "../enum/schemaType"
import { type ValueSchemaTypeValue } from "../enum/valueSchemaType"
import { type INodeSchema } from "../schema/nodeSchema"
import { type IPropertySchema } from "../schema/propertySchema"
import { SchemaLoadState } from "../schema/nodeSchema"
import { type ILocaleString } from "../utils/locale"
import { isNull } from "../utils/toolset"
import { type EnumNode } from "../node/enumNode"
import { type ScalarNode } from "../node/scalarNode"
import { type StructNode } from "../node/structNode"
import { type ArrayNode } from "../node/arrayNode"

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base interface for all property instances attached to a schema.
 */
export interface IProperty {
    /** Canonical property name, e.g. "upLimit", "require", "desc" */
    readonly propertyName: string
    /** Whether the property carries a non-empty value */
    readonly hasValue: boolean
    /** Raw value (untyped) */
    readonly value: any
}

/**
 * Constraint property — participates in validation.
 * Return `true` = valid, `false` = invalid, `undefined/null` = not applicable.
 */
export interface IConstraintProperty extends IProperty {
    validateScalar?(node: ScalarNode, parent?: StructNode): boolean | undefined
    validateEnum?(node: EnumNode, parent?: StructNode): boolean | undefined
    validateScalarAsync?(node: ScalarNode, parent?: StructNode): Promise<boolean | undefined>
    validateEnumAsync?(node: EnumNode, parent?: StructNode): Promise<boolean | undefined>
    validateArray?(node: ArrayNode, parent?: StructNode): Promise<boolean | undefined>
    validateStruct?(node: StructNode, parent?: StructNode): boolean | undefined
}

/**
 * Marker for properties whose value is a reference to a schema type name.
 */
export interface ITypeRefProperty extends IProperty {}

/**
 * Marker for properties that are computed from relations and are not user-settable.
 */
export interface IRelationOnlyProperty extends IProperty {}

/**
 * Marker for convert properties used in RecognizerPart to specify
 * formatting and parsing transformations (e.g. layout, mapping, minDigits).
 */
export interface IConvertProperty extends IProperty {}

// ─────────────────────────────────────────────────────────────────────────────
// Registration metadata
// ─────────────────────────────────────────────────────────────────────────────

export interface PropertyDefOptions {
    /** Override the default property name derived from the class name. */
    name?: string
    /** Human-readable display name or locale key. */
    display?: ILocaleString | string
    /** Schema types this property applies to. */
    forSchemas: SchemaTypeValue[]
    /** Value schema type refinements; absent/empty = all. */
    forValues?: ValueSchemaTypeValue[]
    /** When true, also match the element type of an array schema. */
    includeArray?: boolean
    /** Required dependency property names (topological ordering). */
    depends?: string[]
    /** Optional dependency property names (soft ordering). */
    optionDepends?: string[]
    /** Override the value schema type name used in the IPropertySchema. */
    schemaType?: string
}

export interface PropertyEntry {
    /** Canonical property name (camelCase) */
    name: string
    options: PropertyDefOptions
    /** The concrete class factory */
    factory: () => IProperty
    /** Kind flags gathered from interface markers */
    constraint: boolean
    typeref: boolean
    relationOnly: boolean
    convert: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

const _registry = new Map<string, PropertyEntry>()

/**
 * All registered property entries, indexed by canonical name (lowercase).
 */
export function getPropertyRegistry(): ReadonlyMap<string, PropertyEntry> {
    return _registry
}

/**
 * Register a property class.  Invoked by the `@PropertyDef(...)` decorator.
 * @param cls         The property class constructor
 * @param options     Registration options
 */
export function registerProperty<T extends IProperty>(
    cls: new () => T,
    options: PropertyDefOptions,
): void {
    // Derive canonical name
    let name = options.name
    if (!name) {
        name = cls.name
        if (name.endsWith("Property")) name = name.slice(0, -"Property".length)
        name = toCamelCase(name)
    }

    // Detect interface marker kinds via duck-typing
    const proto = cls.prototype
    const constraint = typeof proto.validateScalar === "function"
        || typeof proto.validateEnum === "function"
        || typeof proto.validateScalarAsync === "function"
        || typeof proto.validateEnumAsync === "function"
        || typeof proto.validateArray === "function"
        || typeof proto.validateStruct === "function"
    // ITypeRefProperty / IRelationOnlyProperty / IConvertProperty use explicit tagging fields
    const typeref: boolean = (proto as any).__isTypeRef === true
    const relationOnly: boolean = (proto as any).__isRelationOnly === true
    const convert: boolean = (proto as any).__isConvert === true

    const entry: PropertyEntry = {
        name,
        options,
        factory: () => new cls(),
        constraint,
        typeref,
        relationOnly,
        convert,
    }

    _registry.set(name.toLowerCase(), entry)
}

/**
 * Class decorator for registering a property.
 * 
 * @example
 * ```ts
 * @PropertyDef({ forSchemas: [SchemaType.StructField], forValues: [ValueSchemaType.All] })
 * export class RequireProperty extends SchemaProperty<boolean> implements IConstraintProperty { ... }
 * ```
 */
export function PropertyDef(options: PropertyDefOptions) {
    return function <T extends IProperty>(cls: new () => T): void {
        registerProperty(cls, options)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Base class
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Abstract base for all property value holders.
 * @typeParam T The type of the property's value.
 */
export abstract class SchemaProperty<T> implements IProperty {
    protected _name: string = ""
    protected _value: T | undefined
    protected _hasValue: boolean = false

    get propertyName(): string { return this._name }
    get hasValue(): boolean { return this._hasValue }
    get value(): any { return this._value }

    /**
     * Set the raw JSON-parsed value onto this property instance.
     * Override for custom coercion/initialization.
     */
    setValue(raw: any): void {
        this._value = raw as T
        this._hasValue = !isNull(raw)
    }

    /**
     * Hook called after setValue() — subclasses may override for post-init.
     */
    init(): void { }
}

// ─────────────────────────────────────────────────────────────────────────────
// Instance builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build and return all property instances that match the given schema context,
 * extracting values from the schema node's `additional` data (i.e., the
 * property key/value pairs stored in the IPropertySchema Additional map or
 * directly on the INodeSchema).
 *
 * The returned array is topologically sorted: dependencies appear before
 * the properties that declare them.
 *
 * @param schemaType       The schema type of the node (e.g. "structField")
 * @param additional       Flat record of property-name → raw value from server
 * @param getValueSchema   Optionally resolve a value schema type for forValues matching
 */
export function getProperties<T extends IProperty>(
    schemaType: SchemaTypeValue,
    additional: Record<string, any>,
    getValueSchema?: () => ValueSchemaTypeValue | undefined,
): T[] {
    const matched: Array<{ name: string; entry: PropertyEntry; instance: T }> = []
    const valueSchemaType = getValueSchema?.()

    for (const [key, entry] of _registry) {
        // 1. ForSchemas filter
        if (!entry.options.forSchemas.includes(schemaType)) continue

        // 2. ForValues filter
        if (
            entry.options.forValues?.length &&
            !(entry.options.forValues.includes("all" as ValueSchemaTypeValue)) &&
            valueSchemaType &&
            !entry.options.forValues.includes(valueSchemaType)
        ) continue

        // 3. Property key must exist in additional
        const propName = entry.name
        if (!(propName in additional) && !(propName.toLowerCase() in additional)) continue

        const rawValue = additional[propName] ?? additional[propName.toLowerCase()]
        if (isNull(rawValue)) continue

        // 4. Build instance
        const instance = entry.factory() as T
        ;(instance as any)._name = propName
        ;(instance as unknown as SchemaProperty<any>).setValue(rawValue)
        ;(instance as unknown as SchemaProperty<any>).init()

        if (instance.hasValue) {
            matched.push({ name: propName, entry, instance })
        }
    }

    // Topological sort (same algorithm as C#)
    const indexMap = new Map<string, number>()
    matched.forEach((m, i) => indexMap.set(m.name.toLowerCase(), i))

    const count = matched.length
    const visited = new Array<boolean>(count).fill(false)
    const onStack = new Array<boolean>(count).fill(false)
    const sorted: T[] = []

    function visit(i: number) {
        if (onStack[i] || visited[i]) return
        onStack[i] = true

        // visit required deps
        for (const dep of matched[i].entry.options.depends ?? []) {
            const di = indexMap.get(dep.toLowerCase())
            if (di !== undefined) visit(di)
            // hard dependency missing → skip silently on the frontend
        }
        // visit optional deps
        for (const dep of matched[i].entry.options.optionDepends ?? []) {
            const di = indexMap.get(dep.toLowerCase())
            if (di !== undefined) visit(di)
        }

        onStack[i] = false
        visited[i] = true
        sorted.push(matched[i].instance)
    }

    for (let i = 0; i < count; i++) {
        if (!visited[i]) visit(i)
    }

    return sorted
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema generation helpers (used to synthesize INodeSchema for property type)
// ─────────────────────────────────────────────────────────────────────────────

const NS_SYSTEM_PROPERTY = "system.property"

/**
 * Generate INodeSchema entries for all registered property classes.
 * These are suitable for use with `registerSchema(...)`.
 */
export function generatePropertySchemas(): INodeSchema[] {
    const result: INodeSchema[] = []
    for (const [, entry] of _registry) {
        const propertySchema: IPropertySchema = {
            property: entry.name,
            forSchemas: entry.options.forSchemas,
            forValues: entry.options.forValues,
            includeArray: entry.options.includeArray,
            depends: entry.options.depends?.map(trimPropertySuffix),
            optionDepends: entry.options.optionDepends?.map(trimPropertySuffix),
            constraint: entry.constraint || undefined,
            typeref: entry.typeref || undefined,
            relationOnly: entry.relationOnly || undefined,
            convert: entry.convert || undefined,
        }
        const schema: INodeSchema = {
            name: `${NS_SYSTEM_PROPERTY}.${entry.name.toLowerCase()}`,
            type: "property",
            display: typeof entry.options.display === "string"
                ? { key: entry.options.display }
                : (entry.options.display as ILocaleString | undefined),
            property: propertySchema,
            loaded: true,
            loadState: SchemaLoadState.System,
        }
        result.push(schema)
    }
    return result
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function toCamelCase(s: string): string {
    if (!s) return s
    return s.charAt(0).toLowerCase() + s.slice(1)
}

function trimPropertySuffix(name: string): string {
    return name.endsWith("Property") ? name.slice(0, -"Property".length) : name
}
