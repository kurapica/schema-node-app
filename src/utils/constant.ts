export const SCHEMA_KIND_APP = "app";
export const SCHEMA_KIND_APP_FIELD = "appfield";
export const SCHEMA_KIND_APP_WORKFLOW = "appworkflow";
export const SCHEMA_KIND_APP_WORKFLOW_NODE = "appworkflownode";

export const SCHEMA_KIND_EVENT = "event";
export const SCHEMA_KIND_WORKFLOW = "workflow";

export const SCHEMA_KIND_ORDER_EVENT = 20;
export const SCHEMA_KIND_ORDER_WORKFLOW = 21;
export const SCHEMA_KIND_ORDER_APP = 30;
export const SCHEMA_KIND_ORDER_APP_FIELD = 31;
export const SCHEMA_KIND_ORDER_APP_WORKFLOW = 32;
export const SCHEMA_KIND_ORDER_APP_WORKFLOW_NODE = 33;

export const NS_SYSTEM_EVENT = "system.event";
export const NS_SYSTEM_WORKFLOW = "system.workflow";
export const NS_SYSTEM_WORKFLOW_CRON = `${NS_SYSTEM_WORKFLOW}.cron`;
export const NS_SYSTEM_WORKFLOW_NODE = `${NS_SYSTEM_WORKFLOW}.node`;
export const NS_SYSTEM_WORKFLOW_CONTROL = `${NS_SYSTEM_WORKFLOW}.control`;
export const NS_SYSTEM_WORKFLOW_INTERACTION = `${NS_SYSTEM_WORKFLOW}.interaction`;
export const NS_SYSTEM_WORKFLOW_EVENT = `${NS_SYSTEM_WORKFLOW}.event`;

export const NS_SYSTEM_SCHEMA = "system.schema";
export const NS_SYSTEM_SCHEMA_APP = `${NS_SYSTEM_SCHEMA}.${SCHEMA_KIND_APP}`;
export const NS_SYSTEM_SCHEMA_APP_FIELD = `${NS_SYSTEM_SCHEMA_APP}.field`;
export const NS_SYSTEM_SCHEMA_APP_WORKFLOW = `${NS_SYSTEM_SCHEMA_APP}.workflow`;
export const NS_SYSTEM_SCHEMA_EVENT = `${NS_SYSTEM_SCHEMA}.${SCHEMA_KIND_EVENT}`;
export const NS_SYSTEM_SCHEMA_WORKFLOW = `${NS_SYSTEM_SCHEMA}.${SCHEMA_KIND_WORKFLOW}`;


export const NS_SYSTEM_SCHEMA_REFLECT = `${NS_SYSTEM_SCHEMA}.reflect`;
export const NS_SYSTEM_SCHEMA_REFLECT_APP = `${NS_SYSTEM_SCHEMA_REFLECT}.app`;

export const NS_SYSTEM_SCHEMA_PROPERTY = `${NS_SYSTEM_SCHEMA}.prop`;
export const NS_SYSTEM_SCHEMA_PROPERTY_APP = `${NS_SYSTEM_SCHEMA_PROPERTY}.app`;

// workflow kind
export const WORKFLOW_KIND_WORKFLOW = "workflow";
export const WORKFLOW_KIND_CALL = "call";
export const WORKFLOW_KIND_EVENT = "event";
export const WORKFLOW_KIND_INTERACTION = "interaction";