import { type ISchemaConfig } from "../config/schemaConfig"
import { type IFunctionCallArgument } from "./functionSchema"
import { type IScalarConfig } from "../config/scalarConfig"
import { type IEnumConfig } from "../config/enumConfig"
import { type IArrayConfig } from "../config/arrayConfig"

/**
 * The struct schema.
*/
export interface IStructSchema
{
    /**
     * The base struct type to be inherited from.
    */
    base?: string

    /**
     * The struct fields.
    */
    fields: IStructFieldSchema[]

    /**
     * The realtions between the fields
     */
    relations?: IStructRelationSchema[]

    /**
     * The union validations
     */
    unionValids?: IStructUnionValidation[]

    /**
     * The atomic flag indicates whether the struct is atomic, which means that the struct
     * should be treated as a whole when performing operations such as updates, delete or render.
     */
    atomic?: boolean
}

/**
 * The struct field config
 */
export interface IStructFieldSchema extends ISchemaConfig
{
    /**
     * The field name
     */
    name: string
}

export interface IStructScalarFieldConfig extends IStructFieldSchema, IScalarConfig {}
export interface IStructEnumFieldConfig extends IStructFieldSchema, IEnumConfig {}
export interface IStructArrayFieldConfig extends IStructFieldSchema, IArrayConfig {}

/**
 * The realtion between fields
*/
export interface IStructRelationSchema
{
    /**
     * The target field, can use . for deep fields
    */
    field: string

    /**
     * The property of the relation, references a system property schema name
     * (e.g. "visible", "invisible", "assign", "disable", "default", "initOnly", "type", etc.)
    */
    prop: string

    /**
     * The relation function
    */
    func: string

    /**
     * The func arguments
    */
    args: IFunctionCallArgument[]
}

/**
 * The union validation of a struct
 */
export interface IStructUnionValidation
{
    /**
     * The validation function
     */
    func: string

    /**
     * The func arguments
     */
    args: IFunctionCallArgument[]
}
