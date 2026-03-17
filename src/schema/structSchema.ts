import { type RelationTypeValue } from "../enum/relationType"
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
     * The relation function
    */
    func: string

    /**
     * The func arguments
    */
    args: IFunctionCallArgument[]

    /**
     * The realtion type
    */
    type: RelationTypeValue
}
