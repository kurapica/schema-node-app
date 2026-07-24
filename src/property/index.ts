// Core base types and registration utilities
export {
    type IProperty,
    type IConstraintProperty,
    type ITypeRefProperty,
    type IRelationOnlyProperty,
    type IConvertProperty,
    type PropertyDefOptions,
    type PropertyEntry,
    SchemaProperty,
    PropertyDef,
    registerProperty,
    getPropertyRegistry,
    getProperties,
    generatePropertySchemas,
} from "./propertyBase"

// Pattern matching engine (cross-platform, Lua-pattern-style)
export {
    PatternType,
    type PatternTypeValue,
    type ICharRange,
    type IPattern,
    matchPattern,
    isPatternMatch,
    CharRange,
} from "./patternType"

// Constraint properties
export {
    RequireProperty,
    PatternProperty,
    UpLimitStringProperty,
    UpLimitNumberProperty,
    UpLimitDateProperty,
    LowLimitStringProperty,
    LowLimitNumberProperty,
    LowLimitDateProperty,
    WhiteListProperty,
    BlackListProperty,
    TypeProperty,
    ValidateProperty,
    CascadeProperty,
    LeafOnlyProperty,
    SingleFlagProperty,
    RootProperty,
} from "./constraint/index"

// Presentation properties
export {
    DefaultProperty,
    DescProperty,
    ErrorProperty,
    ImmutableProperty,
    ReadonlyProperty,
    DisplayOnlyProperty,
    InvisibleProperty,
    VisibleProperty,
    UnitProperty,
    UnpackProperty,
    StackUpLimitProperty,
} from "./presentation/index"

// Convert properties (used in RecognizerPart for format/parse transformations)
export {
    LayoutConvertProperty,
    MappingConvertProperty,
    MaxDigitsConvertProperty,
    PadCharConvertProperty,
    PadLeftConvertProperty,
    MinDigitsConvertProperty,
    PrecisionConvertProperty,
    ToLowerConvertProperty,
    ToUpperConvertProperty,
    TrimConvertProperty,
    ParseFuncConvertProperty,
    FormatFuncConvertProperty,
} from "./convert/index"
