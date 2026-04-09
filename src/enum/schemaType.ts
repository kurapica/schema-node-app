/**
 * Schema types.
 */
export enum SchemaType
{
    /**
     * The namespace node
     */
    Namespace = "namespace",

    /**
     * The scalar node
     */
    Scalar = "scalar",

    /**
     * The num node
     */
    Enum = "enum",

    /**
     * The struct node
     */
    Struct = "struct",

    /**
     * The struct field node, sub-schema of the struct node
     */
    StructField = "structField",

    /**
     * The array node
     */
    Array = "array",

    /**
     * The json node
     */
    Json = "json",
    
    /**
     * The event node
     */
    Event = "event",

    /**
     * The workflow node
     */
    Workflow = "workflow",

    /**
     * The policy node
     */
    Policy = "policy",

    /**
     * The function node
     */
    Func = "func",

    /**
     * The recognizer node
     */
    Recognizer = "recognizer",

    /**
     * The recognizer part node, sub-schema of the recognizer node
     */
    RecognizerPart = "recognizerPart",

    /**
     * The property node
     */
    Property = "property",

    /**
     * The application node
     */
    App = "app",

    /**
     * The application field node
     */
    AppField = "appField",

    /**
     * The application workflow node
     */
    AppWorkflow = "appWorkflow",
}

export type SchemaTypeValue = `${SchemaType}`