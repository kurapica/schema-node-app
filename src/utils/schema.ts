import { BigNumber } from "bignumber.js"
import { SchemaType } from "../enum/schemaType"
import { RecognizerPartType } from "../enum/RecognizerPartType"
import { registerSchema, NS_SYSTEM, NS_SYSTEM_ARRAY, NS_SYSTEM_BOOL, NS_SYSTEM_DATE, NS_SYSTEM_FULLDATE, NS_SYSTEM_INT, NS_SYSTEM_NUMBER, NS_SYSTEM_STRING, NS_SYSTEM_STRUCT, NS_SYSTEM_YEAR, NS_SYSTEM_YEARMONTH, NS_SYSTEM_DOUBLE, NS_SYSTEM_FLOAT, NS_SYSTEM_INTS, NS_SYSTEM_NUMBERS, NS_SYSTEM_RANGEDATE, NS_SYSTEM_RANGEFULLDATE, NS_SYSTEM_RANGEMONTH, NS_SYSTEM_RANGEYEAR, NS_SYSTEM_STRINGS, NS_SYSTEM_PERCENT, NS_SYSTEM_GUID, NS_SYSTEM_ENTRIES, NS_SYSTEM_ENTRY, NS_SYSTEM_LOCALE_STRING, NS_SYSTEM_LANGUAGE, NS_SYSTEM_LOCALE_TRAN, NS_SYSTEM_LOCALE_TRANS, NS_SYSTEM_LOCALE_STRINGS, NS_SYSTEM_JSON, NS_SYSTEM_SCHEMA, NS_SYSTEM_SCHEMA_NS, NS_SYSTEM_WORKFLOW, NS_SYSTEM_WORKFLOW_NODE, NS_SYSTEM_LIST, NS_SYSTEM_SCHEMA_STATUS, NS_SYSTEM_INTRINSIC_IFRET, NS_SYSTEM_INTRINSIC_IFNOT, NS_SYSTEM_INTRINSIC_IFNULL, NS_SYSTEM_INTRINSIC_IFEMPTY, NS_SYSTEM_OBJECT, NS_SYSTEM_WORKFLOW_ID, NS_SYSTEM_WORKFLOW_CRON, getEnumAccessList, NS_SYSTEM_IDENTIFIER } from "./schemaProvider"
import { _LS, SCHEMA_LANGUAGES, type ILocaleString } from "./locale"
import { deepClone, generateGuid, isEmpty, isEqual, isNull } from "./toolset"
import { type INodeSchema, SchemaLoadState } from "../schema/nodeSchema"
import { type IStructEnumFieldConfig, type IStructRelationSchema, type IStructScalarFieldConfig } from "../schema/structSchema"
import { type IFunctionArgumentInfo } from "../schema/functionSchema"
import { EnumValueType } from "../enum/enumValueType"
import { RelationType } from "../enum/relationType"
import { ExpressionType } from "../enum/expressionType"
import { DataCombineType } from "../enum/dataCombineType"
import { WorkflowMode } from "../enum/workflowMode"
import { PolicyCombine } from "../enum/policyCombine"
import { PolicyScope } from "../enum/policyScope"
import { SchemaNodeStatus } from "../enum/schemaNodeStatus"
import { WorkflowStatus } from "../enum/workflowStatus"
import { FieldFilterMode, FieldFilterResolve } from "../enum/fieldFilterMode"
import { FieldStorageTopology } from "../enum/fieldStorageTopology"
import { AppScopeType } from "../enum/appScopeType"

//#region Utility

export const newSystemSchema = (name: string, schemas?: INodeSchema[], type: SchemaType = SchemaType.Namespace): INodeSchema => {
    return { name, type, display: _LS(name), loadState: SchemaLoadState.System, schemas: schemas }
}

export const newSystemScalar = (name: string, base?: string, error?: boolean, regex?: string, options?: {}): INodeSchema => {
    return {
        name,
        type: SchemaType.Scalar,
        display: _LS(name),
        loadState: SchemaLoadState.System,
        scalar: { base, error: error ? _LS(`${name}.error`) : undefined, regex, ...options }
    }
}

export const newSystemArray = (name: string, element: string, ...primary: string[]): INodeSchema => {
    return { name, type: SchemaType.Array, display: _LS(element && element !== "T" ? `{[LIST.PREFIX]}{@${element}}{[LIST.SUFFIX]}` : name), loadState: SchemaLoadState.System, array: { element, primary } }
}
export const newSystemRelArray = (name: string, element: string, relations: IStructRelationSchema[], ...primary: string[]): INodeSchema => {
    return { name, type: SchemaType.Array, display: _LS(element ? `{[LIST.PREFIX]}{@${element}}{[LIST.SUFFIX]}` : name), loadState: SchemaLoadState.System, array: { element, primary, relations } }
}

export const newSystemStruct = (name: string, fields: (IStructScalarFieldConfig | IStructEnumFieldConfig)[], relations?: IStructRelationSchema[]): INodeSchema => {
    return {
        name,
        type: SchemaType.Struct,
        display: _LS(name),
        loadState: SchemaLoadState.System,
        struct: { fields: fields.map(f => ({ display: _LS(`${name}.${f.name}`), ...f })), relations },
    }
}

export const newSystemEnum = <T extends Record<string, string | number>>(name: string, e:T): INodeSchema => {
    const entries = Object.entries(e)
    return {
        name,
        type: SchemaType.Enum,
        display: _LS(name),
        loadState: SchemaLoadState.System,
        enum: {
            type: typeof entries[0][1] === "number" ? EnumValueType.Flags : EnumValueType.String,
            values: entries.map(([k, v]) => ({ name: _LS(`${name}.${k.toLowerCase()}`), value: v }))
        }
    }
}

export const newSystemFunc = (name: string, returnType: string, args: IFunctionArgumentInfo[], func: (...args: any[]) => any, generic?: string | string[]): INodeSchema => {
    return {
        name,
        type: SchemaType.Func,
        display: _LS(name),
        loadState: SchemaLoadState.System,
        func: { generic, return: returnType, args, exps: [], func }
    }
}

//#endregion

/**
 * The default schemas
 */
registerSchema([
    newSystemSchema(NS_SYSTEM, [
        // system.object
        newSystemScalar(NS_SYSTEM_OBJECT),

        //#region base type
        newSystemArray(NS_SYSTEM_ARRAY, ""),
        newSystemArray(NS_SYSTEM_LIST, "T"),
        newSystemStruct(NS_SYSTEM_STRUCT, []),
        newSystemSchema(NS_SYSTEM_JSON, undefined, SchemaType.Json),
        //#endregion

        //#region scalar
        newSystemScalar(NS_SYSTEM_BOOL, undefined, true),
        newSystemScalar(NS_SYSTEM_DATE, undefined, true),
        newSystemScalar(NS_SYSTEM_NUMBER, undefined, true, "^(\\-|\\+)?\\d+(\\.\\d+)?(e\\-\\d+)?$"),
        newSystemScalar(NS_SYSTEM_DOUBLE, NS_SYSTEM_NUMBER, true, "^(\\-|\\+)?\\d+\\.?\\d+$"),
        newSystemScalar(NS_SYSTEM_FLOAT, NS_SYSTEM_DOUBLE, true, "^\\d+(\\.\\d+)?$"),
        newSystemScalar(NS_SYSTEM_PERCENT, NS_SYSTEM_FLOAT, true, "^\\d+(\\.\\d+)?$", { upLimit: 100, lowLimit: 0 }),
        newSystemScalar(NS_SYSTEM_FULLDATE, NS_SYSTEM_DATE, true),
        newSystemScalar(NS_SYSTEM_INT, NS_SYSTEM_NUMBER, true, "^(\\-|\\+)?\\d+$"),
        newSystemScalar(NS_SYSTEM_STRING),
        newSystemScalar(NS_SYSTEM_YEAR, NS_SYSTEM_INT, true, "^\\d{4}$"),
        newSystemScalar(NS_SYSTEM_YEARMONTH, NS_SYSTEM_DATE, true),
        newSystemScalar(NS_SYSTEM_GUID, NS_SYSTEM_STRING, false, "^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$", { upLimit: 36 }),
        newSystemScalar(NS_SYSTEM_LANGUAGE, NS_SYSTEM_STRING, false, "^[a-z]{2}-?[A-Z]{2}$", { upLimit: 8, whiteList: "system.str.util.getlanguages" }),
        newSystemScalar(NS_SYSTEM_IDENTIFIER, NS_SYSTEM_STRING, undefined, "^[a-zA-Z]\\w*$", { upLimit: 32 }),

        //#endregion

        //#region struct
        newSystemStruct(NS_SYSTEM_RANGEDATE, [
            { name: "start", type: NS_SYSTEM_DATE, require: true },
            { name: "stop", type: NS_SYSTEM_DATE, require: true }
        ]),
        newSystemStruct(NS_SYSTEM_RANGEFULLDATE, [
            { name: "start", type: NS_SYSTEM_FULLDATE, require: true },
            { name: "stop", type: NS_SYSTEM_FULLDATE, require: true }
        ]),
        newSystemStruct(NS_SYSTEM_RANGEMONTH, [
            { name: "start", type: NS_SYSTEM_YEARMONTH, require: true },
            { name: "stop", type: NS_SYSTEM_YEARMONTH, require: true }
        ]),
        newSystemStruct(NS_SYSTEM_RANGEYEAR, [
            { name: "start", type: NS_SYSTEM_YEAR, require: true },
            { name: "stop", type: NS_SYSTEM_YEAR, require: true }
        ]),
        newSystemStruct(NS_SYSTEM_LOCALE_TRAN, [
            { name: "lang", type: NS_SYSTEM_LANGUAGE, require: true },
            { name: "tran", type: NS_SYSTEM_STRING }
        ]),
        newSystemStruct(NS_SYSTEM_LOCALE_STRING, [
            { name: "key", type: NS_SYSTEM_STRING, upLimit: 128 },
            { name: "trans", type: NS_SYSTEM_LOCALE_TRANS }
        ]),
        newSystemStruct(NS_SYSTEM_ENTRY, [
            { name: "value", type: NS_SYSTEM_STRING, require: true, upLimit: 128 },
            { name: "label", type: NS_SYSTEM_LOCALE_STRING, require: true }
        ]),
        //#endregion

        //#region array

        newSystemArray(NS_SYSTEM_STRINGS, NS_SYSTEM_STRING),
        newSystemArray(NS_SYSTEM_NUMBERS, NS_SYSTEM_NUMBER),
        newSystemArray(NS_SYSTEM_INTS, NS_SYSTEM_INT),
        newSystemArray(NS_SYSTEM_LOCALE_TRANS, NS_SYSTEM_LOCALE_TRAN, "lang"),
        newSystemArray(NS_SYSTEM_LOCALE_STRINGS, NS_SYSTEM_LOCALE_STRING, "key"),
        newSystemArray(NS_SYSTEM_ENTRIES, NS_SYSTEM_ENTRY, "value"),

        //#endregion

        //#region function

        // conversion func
        newSystemSchema("system.intrinsic", [
            newSystemFunc("system.intrinsic.assign", "T", [ { name: "input", type: "T" }], deepClone),

            newSystemFunc("system.intrinsic.default", "T", [
                { name: "input", type: "T", nullable: true },
                { name: "default", type: "T" }
            ], (a: any, d: any) => isNull(a) ? d : a),

            newSystemFunc("system.intrinsic.null", "T", [], () => null),

            // terminate execution
            newSystemFunc(NS_SYSTEM_INTRINSIC_IFRET, "T", [
                { name: "cond", type: NS_SYSTEM_BOOL },
                { name: "ret", type: "T" }
            ], (cond: boolean, ret: any) => ret),
            
            newSystemFunc(NS_SYSTEM_INTRINSIC_IFNOT, "T", [
                { name: "cond", type: NS_SYSTEM_BOOL },
                { name: "ret", type: "T" }
            ], (cond: boolean, ret: any) => ret),

            newSystemFunc(NS_SYSTEM_INTRINSIC_IFNULL, "T1", [
                { name: "val", type: "T2" },
                { name: "ret", type: "T1" }
            ], (val: any, ret: any) => ret, [ "T1", "T2"]),

            newSystemFunc(NS_SYSTEM_INTRINSIC_IFEMPTY, "T1", [
                { name: "val", type: "T2" },
                { name: "ret", type: "T1" }
            ], (val: any, ret: any) => ret, [ "T1", "T2"]),
        ]),

        // string func
        newSystemSchema("system.str", [
            newSystemSchema("system.str.logic", [
                newSystemFunc("system.str.logic.startswith", NS_SYSTEM_BOOL, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "prefix", type: NS_SYSTEM_STRING }], (a: string, b: string) => a.startsWith(b)),
                newSystemFunc("system.str.logic.notstartswith", NS_SYSTEM_BOOL, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "prefix", type: NS_SYSTEM_STRING }], (a: string, b: string) => a.startsWith(b)),
                newSystemFunc("system.str.logic.endswith", NS_SYSTEM_BOOL, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "suffix", type: NS_SYSTEM_STRING }], (a: string, b: string) => a.endsWith(b)),
                newSystemFunc("system.str.logic.notendswith", NS_SYSTEM_BOOL, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "suffix", type: NS_SYSTEM_STRING }], (a: string, b: string) => !a.endsWith(b)),
                newSystemFunc("system.str.logic.contains", NS_SYSTEM_BOOL, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "substr", type: NS_SYSTEM_STRING }], (a: string, b: string) => a.includes(b)),
                newSystemFunc("system.str.logic.notcontains", NS_SYSTEM_BOOL, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "substr", type: NS_SYSTEM_STRING }], (a: string, b: string) => !a.includes(b)),
            ]),

            newSystemSchema("system.str.state", [
                newSystemFunc("system.str.state.len", NS_SYSTEM_INT, [{ name: "text", type: NS_SYSTEM_STRING }], (a: string) => a.length),
                newSystemFunc("system.str.state.isempty", NS_SYSTEM_BOOL, [{ name: "text", type: NS_SYSTEM_STRING }], (a: string) => isNull(a) || isEmpty(a.trim())),
            ]),

            newSystemSchema("system.str.convert", [
                newSystemFunc("system.str.convert.concat", NS_SYSTEM_STRING, [{ name: "x", type: NS_SYSTEM_STRING, nullable: true },{ name: "y", type: NS_SYSTEM_STRING, nullable: true }], (a: string, b: string) => `${(isNull(a) ? "" : a)}${(isNull(b) ? "" : b)}`),
                newSystemFunc("system.str.convert.substr", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "start", type: NS_SYSTEM_INT },{ name: "end", type: NS_SYSTEM_INT, nullable: true }], (a: string, b: number, c?: number) => a.substring(b, c)),
                newSystemFunc("system.str.convert.split", NS_SYSTEM_STRINGS, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "sep", type: NS_SYSTEM_STRING }], (a: string, b: string) => a.split(b).filter(s => s.length)),
                newSystemFunc("system.str.convert.trim", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true }], (a?: string) => (a || "").trim()),
                newSystemFunc("system.str.convert.replace", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING },{ name: "search", type: NS_SYSTEM_STRING },{ name: "replace", type: NS_SYSTEM_STRING, nullable: true }], (str: string, search: string, replace: string) => str.split(search).join(replace || "")),
                newSystemFunc("system.str.convert.tolower", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true }], (a?: string) => (a || "").toLowerCase()),
                newSystemFunc("system.str.convert.toupper", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true }], (a?: string) => (a || "").toUpperCase()),
                newSystemFunc("system.str.convert.reverse", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true }], (a?: string) => (a || "").split("").reverse().join("")),
                newSystemFunc("system.str.convert.padleft", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true },{ name: "length", type: NS_SYSTEM_INT },{ name: "char", type: NS_SYSTEM_STRING, nullable: true }], (a?: string, b?: number, c?: string) => {
                    const str = a || ""
                    const length = b || 0
                    const char = c || " "
                    return str.padStart(length, char)
                }),
                newSystemFunc("system.str.convert.padright", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true },{ name: "length", type: NS_SYSTEM_INT },{ name: "char", type: NS_SYSTEM_STRING, nullable: true }], (a?: string, b?: number, c?: string) => {
                    const str = a || ""
                    const length = b || 0
                    const char = c || " "
                    return str.padEnd(length, char)
                }),
                newSystemFunc("system.str.convert.repeat", NS_SYSTEM_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true },{ name: "times", type: NS_SYSTEM_INT }], (a?: string, b?: number) => {
                    const str = a || ""
                    const times = b || 0
                    return str.repeat(times)
                }),
            ]),

            newSystemSchema("system.str.map", [
                newSystemFunc("system.str.map.tolocale", NS_SYSTEM_LOCALE_STRING, [{ name: "str", type: NS_SYSTEM_STRING, nullable: true }], (a?: string) => _LS(a || "")),
                newSystemFunc("system.str.map.toentry", NS_SYSTEM_ENTRY, [
                    { name: "obj", type: NS_SYSTEM_STRUCT },
                    { name: "valueField", type: NS_SYSTEM_STRING },
                    { name: "labelField", type: NS_SYSTEM_STRING }
                ], (obj: any, valueField: string, labelField: string) => {
                    let value = obj ? obj[valueField] : null
                    value = isNull(value) ? "" : `${value}`
                    return {
                        value: obj ? value : "",
                        label: _LS(obj[labelField] || value)
                    }
                }),
                newSystemFunc("system.str.map.toentrys", NS_SYSTEM_ENTRIES, [
                    { name: "objs", type: NS_SYSTEM_ARRAY },
                    { name: "valueField", type: NS_SYSTEM_STRING },
                    { name: "labelField", type: NS_SYSTEM_STRING }
                ], (objs: any[], valueField: string, labelField: string) => {
                    if (!objs || objs.length === 0) return []
                    const temp = new Set<string>()
                    return objs.map(o => {
                        let value = o ? o[valueField] : null
                        value = isNull(value) ? "" : `${value}`
                        return {
                            value: o ? value : "",
                            label: _LS(o[labelField] || value)
                        }
                    }).filter(e => { if (temp.has(e.value)) return false; temp.add(e.value); return true; })
                }),                
                newSystemFunc("system.str.map.rectifylocale", NS_SYSTEM_LOCALE_STRING, [
                    { name: "locale", type: NS_SYSTEM_LOCALE_STRING },
                    { name: "defaultLang", type: NS_SYSTEM_LANGUAGE, nullable: true }
                ], (locale: ILocaleString, defaultLang?: string) => {
                    let key = locale.key
                    if (isNull(key))
                    {
                        if (defaultLang)
                        {
                            defaultLang = defaultLang.toLowerCase()
                            key = locale.trans?.find(t => t.lang.toLowerCase() === defaultLang)?.tran || ""
                        }
                        else
                        {
                            key = locale.trans?.length ? locale.trans[0].tran : ""
                        }
                    }
                    return { key, trans: locale.trans || [] }
                })
            ]),

            newSystemSchema("system.str.util", [
                newSystemFunc("system.str.util.getlanguages", NS_SYSTEM_ENTRIES, [], () => SCHEMA_LANGUAGES),
                newSystemFunc("system.str.util.newguid", NS_SYSTEM_GUID, [], generateGuid),
            ]),
        ]),

        // math func
        newSystemSchema("system.math", [

            newSystemFunc("system.math.add", "T", [
                { name: "numbers", type: NS_SYSTEM_NUMBER, params: true }
            ], (...nums: number[]) => {
                let sum = new BigNumber(0)
                nums.forEach((v: number) => sum = sum.plus(v || 0))
                return sum.toNumber()
            }),

            newSystemFunc("system.math.divide", "T", [
                { name: "numbers", type: NS_SYSTEM_NUMBER, params: true }
            ], (...nums: number[]) => {
                if (!nums.length) return 1;
                let sum = new BigNumber(nums[0]);
                for (let i = 1; i < nums.length; i++)
                {
                    if (!nums[i]) return 0
                    sum = sum.dividedBy(nums[i])
                }
                return sum.toNumber()
            }),

            newSystemFunc("system.math.modulo", "T", [
                { name: "x", type: "T" },
                { name: "y", type: "T" }
            ], (x: number, y: number) => !y ? 0 : new BigNumber(x || 0).modulo(y).toNumber()),

            newSystemFunc("system.math.multiply", "T", [
                { name: "numbers", type: NS_SYSTEM_NUMBER, params: true }
            ], (...nums: number[]) => {
                let sum = new BigNumber(1)
                nums.forEach((v: number) => sum = sum.multipliedBy(v || 0))
                return sum.toNumber()
            }),

            newSystemFunc("system.math.subtract", "T", [
                { name: "numbers", type: NS_SYSTEM_NUMBER, params: true }
            ], (...nums: number[]) => {
                let sum = new BigNumber(nums[0] || 0)
                for(let i = 1; i < nums.length; i++) sum = sum.minus(nums[i] || 0)
                return sum.toNumber()
            }),

            newSystemSchema("system.math.const", [
                newSystemFunc("system.math.const.e", NS_SYSTEM_NUMBER, [], () => Math.E),
                newSystemFunc("system.math.const.pi", NS_SYSTEM_NUMBER, [], () => Math.PI),
            ]),

            newSystemSchema("system.math.numeric", [

                newSystemFunc("system.math.numeric.percent", "T", [
                    { name: "x", type: "T" },
                    { name: "y", type: "T" },
                    { name: "decimals", type: NS_SYSTEM_INT, nullable: true }
                ], (x: number, y: number, d?: number) => {
                    if (!y) return 0
                    const value = new BigNumber(x || 0).dividedBy(y).multipliedBy(100).toNumber()
                    const remain = Math.pow(10, isNull(d) ? 2 : d!)
                    return remain > 0 ? Math.round(remain * value) / remain : value
                }, NS_SYSTEM_NUMBER),

                newSystemFunc("system.math.numeric.abs", "T", [{ name: "x", type: "T" }], (x: number) => new BigNumber(x || 0).abs().toNumber(), NS_SYSTEM_NUMBER),
                newSystemFunc("system.math.numeric.ceiling", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.ceil),
                newSystemFunc("system.math.numeric.clamp", "T", [{ name: "x", type: "T" }, { name: "min", type: "T" }, { name: "max", type: "T" }], (x: number, min: number, max: number) => Math.max(min || 0, Math.min(max || 0, x || 0)), NS_SYSTEM_NUMBER),
                newSystemFunc("system.math.numeric.floor", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.floor),
                newSystemFunc("system.math.numeric.max", "T", [{ name: "numbers", type: NS_SYSTEM_NUMBER, params: true }], Math.max),
                newSystemFunc("system.math.numeric.min", "T", [{ name: "numbers", type: NS_SYSTEM_NUMBER, params: true }], Math.min),
                newSystemFunc("system.math.numeric.ptnum", NS_SYSTEM_NUMBER, [{ name: "percent", type: NS_SYSTEM_PERCENT, nullable: true }], (percent: number | null) => new BigNumber(percent || 0).dividedBy(100).toNumber()),
                newSystemFunc("system.math.numeric.round", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER },{ name: "decimals", type: NS_SYSTEM_INT, nullable: true }], (x: number, d?: number) => Math.round((x || 0) * 1.0 * Math.pow(10, d || 0)) / Math.pow(10, d || 0)),
                newSystemFunc("system.math.numeric.exp", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.exp),
                newSystemFunc("system.math.numeric.log", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.log),
                newSystemFunc("system.math.numeric.sqrt", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.sqrt),
                newSystemFunc("system.math.numeric.cbrt", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.cbrt),
                newSystemFunc("system.math.numeric.log10", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.log10),
                newSystemFunc("system.math.numeric.log2", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.log2),
                newSystemFunc("system.math.numeric.pow", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.pow),
            ]),

            newSystemSchema("system.math.conversion", [
                newSystemFunc("system.math.conversion.todecimal", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], (x: number) => x),
                newSystemFunc("system.math.conversion.todouble", NS_SYSTEM_DOUBLE, [{ name: "x", type: NS_SYSTEM_NUMBER }], (x: number) => x),
                newSystemFunc("system.math.conversion.tointeger", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.floor),
                newSystemFunc("system.math.conversion.tosingle", NS_SYSTEM_FLOAT, [{ name: "x", type: NS_SYSTEM_NUMBER }], (x: number) => x),
            ]),

            newSystemSchema("system.math.bitwise", [
                newSystemFunc("system.math.bitwise.bitand", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_INT }, { name: "y", type: NS_SYSTEM_INT }], (x: number, y: number) => (x || 0) & (y || 0)),
                newSystemFunc("system.math.bitwise.bitleftshift", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_INT }, { name: "y", type: NS_SYSTEM_INT }], (x: number, y: number) => (x || 0) << (y || 0)),
                newSystemFunc("system.math.bitwise.bitor", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_INT }, { name: "y", type: NS_SYSTEM_INT }], (x: number, y: number) => (x || 0) | (y || 0)),
                newSystemFunc("system.math.bitwise.bitrightshift", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_INT }, { name: "y", type: NS_SYSTEM_INT }], (x: number, y: number) => (x || 0) >> (y || 0)),
                newSystemFunc("system.math.bitwise.bitunary", NS_SYSTEM_INT, [{ name: "input", type: NS_SYSTEM_INT }], (x: number) => ~(x || 0)),
                newSystemFunc("system.math.bitwise.bitxor", NS_SYSTEM_INT, [{ name: "x", type: NS_SYSTEM_INT }, { name: "y", type: NS_SYSTEM_INT }], (x: number, y: number) => (x || 0) ^ (y || 0))
            ]),

            newSystemSchema("system.math.trigonometry", [
                newSystemFunc("system.math.trigonometry.acos", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.acos),
                newSystemFunc("system.math.trigonometry.asin", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.asin),
                newSystemFunc("system.math.trigonometry.atan", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.atan),
                newSystemFunc("system.math.trigonometry.cos", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.cos),
                newSystemFunc("system.math.trigonometry.sin", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.sin),
                newSystemFunc("system.math.trigonometry.tan", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.tan),
                newSystemFunc("system.math.trigonometry.acosh", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.acosh),
                newSystemFunc("system.math.trigonometry.asinh", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.asinh),
                newSystemFunc("system.math.trigonometry.atanh", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.atanh),
                newSystemFunc("system.math.trigonometry.cosh", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.cosh),
                newSystemFunc("system.math.trigonometry.sinh", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.sinh),
                newSystemFunc("system.math.trigonometry.tanh", NS_SYSTEM_NUMBER, [{ name: "x", type: NS_SYSTEM_NUMBER }], Math.tanh),
            ]),
        ]),

        // calendar func, since require locale, no other date related func is added here for now, all server side call
        newSystemSchema("system.calendar", [
            newSystemFunc("system.calendar.now", NS_SYSTEM_DATE, [], () => new Date()),
        ]),

        // collection func
        newSystemSchema("system.collection", [
            newSystemFunc("system.collection.length", NS_SYSTEM_INT, [{ name: "array", type: "T" }], (arr: any[]) => arr.length, NS_SYSTEM_ARRAY),

            newSystemFunc("system.collection.getfield", "T2", [{ name: "struct", type: "T1" },{ name: "field", type: NS_SYSTEM_STRING },{ name: "default", type: "T2" }], (a: any, f: string, d: any) =>  (a ? a[f] : null) ?? d, NS_SYSTEM_STRUCT),

            newSystemFunc("system.collection.getfields", "T2", [
                { name: "array", type: "T1" },
                { name: "field", type: NS_SYSTEM_STRING }
            ], (a: any[], f: string) => {
                return a.map(l => l[f]).filter(v => !isNull(v))
            }, NS_SYSTEM_ARRAY),
            
            newSystemFunc("system.collection.contains", NS_SYSTEM_BOOL, [
                { name: "array", type: NS_SYSTEM_ARRAY },
                { name: "value", type: "T" }
            ], (arr: any[], v: any) => arr.includes(v)),

            newSystemFunc("system.collection.notcontains", NS_SYSTEM_BOOL, [
                { name: "array", type: NS_SYSTEM_ARRAY },
                { name: "value", type: "T" }
            ], (arr: any[], v: any) => arr.includes(v)),

            newSystemFunc("system.collection.orderby", NS_SYSTEM_ARRAY, [
                { name: "array", type: NS_SYSTEM_ARRAY },
                { name: "field", type: NS_SYSTEM_STRING },
                { name: "descending", type: NS_SYSTEM_BOOL }
            ], (arr: any[], field: string, descending: boolean) => {
                const newArr = [...arr]
                newArr.sort((a, b) => {
                    const valA = a[field]
                    const valB = b[field]
                    if (isNull(valA) && isNull(valB)) return 0
                    if (isNull(valA)) return 1
                    if (isNull(valB)) return -1
                    if (valA < valB) return -1
                    if (valA > valB) return 1
                    return 0
                })
                if (descending) newArr.reverse()
                return newArr
            }),

            newSystemFunc("system.collection.skip", NS_SYSTEM_ARRAY, [
                { name: "array", type: NS_SYSTEM_ARRAY },
                { name: "value", type: NS_SYSTEM_INT }
            ], (arr: any[], count: number) => { return arr.slice(count) }),

            newSystemFunc("system.collection.take", NS_SYSTEM_ARRAY, [
                { name: "array", type: NS_SYSTEM_ARRAY },
                { name: "value", type: NS_SYSTEM_INT }
            ], (arr: any[], count: number) => { return arr.slice(0, count) }),
        ]),

        // logic func
        newSystemSchema("system.logic", [
            newSystemFunc("system.logic.and", NS_SYSTEM_BOOL, [
                { name: "x", type: NS_SYSTEM_BOOL },
                { name: "y", type: NS_SYSTEM_BOOL }
            ], (x: Boolean, y: Boolean) => x && y),

            newSystemFunc("system.logic.between", NS_SYSTEM_BOOL, [
                { name: "v", type: "T" },
                { name: "min", type: "T" },
                { name: "max", type: "T" },
                { name: "includeMin", type: NS_SYSTEM_BOOL, nullable: true },
                { name: "includeMax", type: NS_SYSTEM_BOOL, nullable: true }
            ], (v: any, min: any, max: any, includeMin: Boolean, includeMax: Boolean) =>
                (includeMin ? v >= min : v > min) && (includeMax ? v <= max : v < max), NS_SYSTEM_NUMBER),

            newSystemFunc("system.logic.cond", "T", [
                { name: "cond", type: NS_SYSTEM_BOOL },
                { name: "trueValue", type: "T" },
                { name: "falseValue", type: "T" }
            ], (cond: Boolean, trueVal: any, falseVal: any) => cond ? trueVal : falseVal),

            newSystemFunc("system.logic.eq", NS_SYSTEM_BOOL, [
                { name: "x", type: "T" },
                { name: "y", type: "T" }
            ], isEqual),

            newSystemFunc("system.logic.ge", NS_SYSTEM_BOOL, [
                { name: "x", type: "T" },
                { name: "y", type: "T" }
            ], (x: any, y: any) => x >= y),

            newSystemFunc("system.logic.gt", NS_SYSTEM_BOOL, [
                { name: "x", type: "T" },
                { name: "y", type: "T" }
            ], (x: any, y: any) => x > y),

            newSystemFunc("system.logic.isnull", NS_SYSTEM_BOOL, [
                { name: "value", type: "T", nullable: true }
            ], isNull),

            newSystemFunc("system.logic.notnull", NS_SYSTEM_BOOL, [
                { name: "value", type: "T", nullable: true }
            ], (v: any) => !isNull(v)),

            newSystemFunc("system.logic.isempty", NS_SYSTEM_BOOL, [
                { name: "value", type: "T", nullable: true }
            ], isEmpty),

            newSystemFunc("system.logic.notempty", NS_SYSTEM_BOOL, [
                { name: "value", type: "T", nullable: true }
            ], (v: any) => !isEmpty(v)),

            newSystemFunc("system.logic.le", NS_SYSTEM_BOOL, [
                { name: "x", type: "T" },
                { name: "y", type: "T" }
            ], (x: any, y: any) => x <= y),

            newSystemFunc("system.logic.lt", NS_SYSTEM_BOOL, [
                { name: "x", type: "T" },
                { name: "y", type: "T" }
            ], (x: any, y: any) => x < y),

            newSystemFunc("system.logic.not", NS_SYSTEM_BOOL, [
                { name: "x", type: NS_SYSTEM_BOOL }
            ], (x: boolean) => !x),

            newSystemFunc("system.logic.neq", NS_SYSTEM_BOOL, [
                { name: "x", type: "T" },
                { name: "y", type: "T" }
            ], (x: any, y: any) => !isEqual(x, y)),

            newSystemFunc("system.logic.or", NS_SYSTEM_BOOL, [
                { name: "x", type: NS_SYSTEM_BOOL },
                { name: "y", type: NS_SYSTEM_BOOL }
            ], (x: boolean, y: boolean) => x || y),
        ]),

        // data
        newSystemSchema("system.data.enum", [
            newSystemFunc("system.data.enum.isdescendant", NS_SYSTEM_BOOL, [
                { name: "type", type: "system.schema.type.enum" },
                { name: "value", type: NS_SYSTEM_STRING },
                { name: "ancestor", type: NS_SYSTEM_STRING }
            ], async (type: string, value: any, ancestor: any) => {
                value = `${value}`.trim()
                ancestor = `${ancestor}`.trim()
                if (isNull(value) || isNull(ancestor)) return false
                if (value == ancestor) return true

                const access = await getEnumAccessList(type, value)
                return access.some(a => `${a.value}` == ancestor)
            }),

            newSystemFunc("system.data.enum.isdescendantany", NS_SYSTEM_BOOL, [
                { name: "type", type: "system.schema.type.enum" },
                { name: "value", type: NS_SYSTEM_STRING },
                { name: "ancestors", type: NS_SYSTEM_STRINGS }
            ], async (type: string, value: any, ancestors: any[]) => {
                value = `${value}`.trim()
                if (isNull(value) || !ancestors || ancestors.length === 0) return false
                ancestors = ancestors.map(a => `${a}`.trim())
                if (ancestors.some(a => value == a)) return true
                
                const access = await getEnumAccessList(type, value)
                return access.some(a => ancestors.some(anc => `${a.value}` == anc))
            }),

            newSystemFunc("system.data.enum.parent", NS_SYSTEM_STRING, [
                { name: "type", type: "system.schema.type.enum" },
                { name: "value", type: NS_SYSTEM_STRING },
                { name: "depth", type: NS_SYSTEM_INT, nullable: true }
            ], async (type: string, value: any, depth: number = 0) => {
                value = `${value}`.trim()
                if (isNull(value)) return null
                const access = await getEnumAccessList(type, value)
                if (!access || access.length === 0) return null
                return depth < 0 
                    ? access.length > 1-depth ? access[access.length + depth - 1].value : null
                    : access.length > depth ? access[depth].value : null;
            }),

            newSystemFunc("system.data.enum.depth", NS_SYSTEM_INT, [
                { name: "type", type: "system.schema.type.enum" },
                { name: "value", type: NS_SYSTEM_STRING }
            ], async (type: string, value: any) => {
                value = `${value}`.trim()
                if (isNull(value)) return null
                const access = await getEnumAccessList(type, value)
                if (!access || access.length === 0) return null
                return access.length - 1
            }),

            newSystemFunc("system.data.enum.lca", NS_SYSTEM_STRING, [
                { name: "type", type: "system.schema.type.enum" },
                { name: "values", type: NS_SYSTEM_STRING, params: true }
            ], async (type: string, ...values: any[]) => {
                const trimmedValues = values.map(v => `${v}`.trim()).filter(v => !isNull(v))
                if (trimmedValues.length === 0) return null
                let access = await getEnumAccessList(type, trimmedValues[0])
                if (!access || access.length === 0) return null
                for (let i = 1; i < trimmedValues.length; i++)
                {
                    const valAccess = await getEnumAccessList(type, trimmedValues[i])
                    if (!valAccess || valAccess.length === 0) return null
                    for (let j = 0; j < access.length; j++)
                    {
                        if (!valAccess.some((va: any) => `${va.value}` == `${access[j].value}`))
                        {
                            access = access.slice(j + 1)
                            break
                        }
                    }
                    if (access.length === 0) return null
                }
                return access.length > 0 ? access[access.length - 1].value : null
            })
        ]),
        
        //#endregion
    
        //#region system.schema
        newSystemSchema(NS_SYSTEM_SCHEMA, [

            // scalar
            newSystemSchema("system.schema.type", [
                newSystemScalar(NS_SYSTEM_SCHEMA_NS, NS_SYSTEM_STRING, undefined, undefined, { upLimit: 128 }),
                newSystemScalar("system.schema.type.any", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.scalar", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.enum", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.struct", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.array", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.func", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.event", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.workflow", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.policy", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.recognizer", NS_SYSTEM_SCHEMA_NS),
                newSystemScalar("system.schema.type.property", NS_SYSTEM_SCHEMA_NS),

                newSystemSchema("system.schema.type.rule", [
                    newSystemScalar("system.schema.type.rule.arrayelement", NS_SYSTEM_SCHEMA_NS),
                    newSystemScalar("system.schema.type.rule.value", NS_SYSTEM_SCHEMA_NS),
                    newSystemScalar("system.schema.type.rule.valid", "system.schema.type.func"),
                    newSystemScalar("system.schema.type.rule.whitelist", "system.schema.type.func"),
                    newSystemScalar("system.schema.type.rule.predicate", "system.schema.type.func"),
                    newSystemScalar("system.schema.type.rule.evaluator", "system.schema.type.func"),
                    newSystemArray("system.schema.type.rule.evaluators", "system.schema.type.rule.evaluator")
                ]),
            ]),

            newSystemSchema("system.schema.domain", [
                newSystemScalar("system.schema.domain.app", NS_SYSTEM_STRING, undefined, undefined, { upLimit: 128 }),
                newSystemScalar("system.schema.domain.field", NS_SYSTEM_IDENTIFIER),
                newSystemScalar("system.schema.domain.target", NS_SYSTEM_STRING, undefined, undefined, { upLimit: 128, asSuggest: true, whiteList: "frontend.design.defaultapptargets" }),
            ]),

            newSystemSchema("system.schema.def", [
                newSystemEnum("system.schema.def.schematype", SchemaType),

                newSystemSchema("system.schema.def.scalar", [
                ]),
                newSystemSchema("system.schema.def.enum", [
                    newSystemEnum("system.schema.def.enum.valuetype", EnumValueType),
                ]),
                newSystemSchema("system.schema.def.struct", [
                    newSystemEnum("system.schema.def.struct.relationtype", RelationType),
                ]),
                newSystemSchema("system.schema.def.array", [
                    newSystemEnum("system.schema.def.array.datacombinetype", DataCombineType),
                ]),
                newSystemSchema("system.schema.def.func", [
                    newSystemEnum("system.schema.def.func.exptype", ExpressionType),
                ]),
                newSystemSchema("system.schema.def.policy", [
                    newSystemEnum("system.schema.def.policy.scope", PolicyScope),
                    newSystemEnum("system.schema.def.policy.combine", PolicyCombine),
                    newSystemArray("system.schema.def.policy.scopes", "system.schema.def.policy.scope"),
                ]),
                newSystemSchema("system.schema.def.event", [

                ]),
                newSystemSchema("system.schema.def.workflow", [
                ]),
                newSystemSchema("system.schema.def.recognizer", [
                    newSystemEnum("system.schema.def.recognizer.parttype", RecognizerPartType),
                ]),
                newSystemSchema("system.schema.def.property", [
                ]),
                newSystemSchema("system.schema.def.app", [
                    newSystemEnum("system.schema.def.app.scope", AppScopeType),
                    newSystemSchema("system.schema.def.app.field", [
                        newSystemEnum("system.schema.def.app.field.topology", FieldStorageTopology),
                        newSystemEnum("system.schema.def.app.field.filterresolve", FieldFilterResolve),
                        newSystemEnum("system.schema.def.app.field.filtermode", FieldFilterMode),
                    ]),
                    newSystemSchema("system.schema.def.app.workflow", [
                    ]),
                ]),
            ]),

            // enum
            newSystemEnum(NS_SYSTEM_SCHEMA_STATUS, SchemaNodeStatus),
        ]),
        //#endregion

        //#region system.workflow
        newSystemSchema(NS_SYSTEM_WORKFLOW, [
            newSystemEnum("system.workflow.status", WorkflowStatus),
            newSystemEnum("system.workflow.mode", WorkflowMode),

            // scalar
            newSystemScalar(NS_SYSTEM_WORKFLOW_ID, NS_SYSTEM_STRING, undefined, undefined, { upLimit: 128 }),
            newSystemScalar(NS_SYSTEM_WORKFLOW_CRON, NS_SYSTEM_STRING, undefined, undefined, { upLimit: 128 }),
            newSystemScalar(NS_SYSTEM_WORKFLOW_NODE, NS_SYSTEM_STRING, undefined, undefined, { upLimit: 32 }),
        ]),
        //#endregion

        newSystemSchema("frontend", [
            newSystemSchema("frontend.design", [
                // function
                newSystemFunc("frontend.design.defaultapptargets", NS_SYSTEM_STRINGS, [], () => ["00000000-0000-0000-0000-000000000000"]),
            ])
        ])
    ])
], SchemaLoadState.System)