import { Meta, SchemaType, OfNodeKind, getNodeType, Require, Return, ArgName, _LS, combinePaths, Display, EntryRoot, getPropertyValue, NODE_KIND_ARRAY, NS_SYSTEM_ENTRY_ACCESS, NS_SYSTEM_LIST, NS_SYSTEM_STRING, setPropertyValue, ValueType, type Entry, type EntryAccess } from "schema-node-core";
import { WorkflowType } from "../schema/workflow/runtime";
import { Forkable } from "../schema/workflow/property";

import { NODE_KIND_FUNCTION, NS_SYSTEM_BOOL } from "schema-node-core";
import { NS_SYSTEM_SCHEMA_APP_WORKFLOW, NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW, NS_SYSTEM_SCHEMA_WORKFLOW } from "../utils";
import type { AppWorkflowNodeSchema } from "../schema";

@Meta(SchemaType, NS_SYSTEM_SCHEMA_REFLECT_WORKFLOW)
@Meta(OfNodeKind, NODE_KIND_FUNCTION)
export class SystemReflectWorkflow
{
  /** Whether the workflow kind is the same */
  @Meta(Return, NS_SYSTEM_BOOL)
  static async iskind(
    @Meta(ArgName, "workflow")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    workflow: string | undefined,

    @Meta(ArgName, "kind")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.kind`)
    @Meta(Require, true)
    kind: string
  ): Promise<boolean>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return workflowType?.workflowKind.toLowerCase() === kind.toLowerCase();
  }

  /** Whether the workflow has args */
  @Meta(Return, NS_SYSTEM_BOOL)
  static async hasargs(
    @Meta(ArgName, "workflow")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string
  ): Promise<boolean>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return !!workflowType?.args?.length;
  }

  /** Whether the workflow has state */
  @Meta(Return, NS_SYSTEM_BOOL)
  static async hasstate(
    @Meta(ArgName, "workflow")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string
  ): Promise<boolean>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return !!workflowType?.state;
  }

  /** Whether the workflow is forkable */
  @Meta(Return, NS_SYSTEM_BOOL)
  static async isforkable(
    @Meta(ArgName, "workflow")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string
  ): Promise<boolean>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return workflowType?.getProperty(Forkable)?.getValue<boolean>() ?? false;
  }

  /** Get the payload type of the workflow */
  @Meta(Return, NS_SYSTEM_SCHEMA_WORKFLOW)
  static async getpayloadtype(
    @Meta(ArgName, "workflow")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string
  ): Promise<string | undefined>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return workflowType?.payload?.name;
  }

  /** Get the state type of the workflow */
  @Meta(Return, NS_SYSTEM_SCHEMA_WORKFLOW)
  static async getstatetype(
    @Meta(ArgName, "workflow")
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_WORKFLOW}.type`)
    @Meta(Require, true)
    workflow: string
  ): Promise<string | undefined>
  {
    const workflowType = workflow ? await getNodeType(workflow) as WorkflowType : undefined;
    return workflowType?.state?.name;
  }

  /** Gets the sub entries of the struct fields */
  @Meta(Return, `${NS_SYSTEM_LIST}<${NS_SYSTEM_ENTRY_ACCESS}<${NS_SYSTEM_STRING}>>`)
  static async getaccessentries(
    @Meta(ArgName, 'nodes')
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_WORKFLOW}.nodes`)
    nodes?: AppWorkflowNodeSchema[],

    @Meta(ArgName, 'previous')
    @Meta(SchemaType, `${NS_SYSTEM_LIST}<${NS_SYSTEM_STRING}`)
    previous?: string[],

    @Meta(ArgName, 'path')
    @Meta(SchemaType, NS_SYSTEM_STRING)
    path?: string,

    @Meta(ArgName, 'root')
    @Meta(SchemaType, NS_SYSTEM_STRING)
    @Meta(EntryRoot, true)
    root?: string
  ): Promise<EntryAccess<string>[]> {
    path = path?.toLowerCase() ?? '';
    root = root?.toLowerCase() ?? '';
    if (path && root && path !== root && !path.startsWith(`${root}.`)) return [];

    // first
    const first: Entry<string>[] = [];
    let curr: Entry<string> | undefined;
    let valueType: ValueType | undefined;

    // filter by previous
    if (nodes?.length && previous?.length){
      const set = new Set(previous);
      const addSet = (prev: string[] | undefined) => {
        if (!prev?.length) return;
        for (const n of nodes) {
          if (set.has(n.name)) continue;
          set.add(n.name);
          addSet(n.previous);
        }
      }
      addSet(previous);
      nodes = nodes.filter(n => set.has(n.name));
    }

    // nodes
    for (let a of nodes ?? [])
    {
      if (!a.name || !a.type) continue;
      const ftype = await getNodeType(a.type) as WorkflowType;
      if (!ftype?.payload) continue;
      const entry: Entry<string> = { value: a.name, hasChildren: ftype.payload.kind !== NODE_KIND_ARRAY && ftype.payload.hasAccessEntries };
      setPropertyValue(entry, Display, getPropertyValue(a, Display) ?? _LS(a.name));
      first.push(entry);
      if (!curr && path && (path === a.name.toLowerCase() || path.startsWith(`${a.name.toLowerCase()}.`))) {
        curr = entry;
        valueType = ftype.payload;
      }
    }

    const result: EntryAccess<string>[] = [ { children: first } ];
    while (valueType)
    {
      const accessEntry: EntryAccess<string> = {};
      const accesses = valueType.kind !== NODE_KIND_ARRAY ? valueType.getAccessEntries() : [];
      if (curr)
      {
        accessEntry.entry = setPropertyValue(
          { value: curr.value, hasChildren: accesses.length > 0 },
          Display,
          getPropertyValue(curr, Display)
        );
      }
      accessEntry.children = accesses;

      // check next part
      let next: ValueType | undefined;
      let nextcurr = curr;
      for (const a of accesses)
      {
        const n = a.value;
        const nvtype = valueType.getAccessValueType(n);
        if (curr) a.value = combinePaths(curr.value, n);
        if (nvtype?.kind === NODE_KIND_ARRAY) a.hasChildren = false;
        if (path && (path === a.value || path.startsWith(a.value + '.')))
        {
          next = nvtype;
          nextcurr = a;
        }
      }
      result.push(accessEntry);
      valueType = next;
      curr = nextcurr;
    }

    // cut
    return root ? result.filter(e => (e.entry?.value?.length ?? 0) >= root.length) : result;
  }

  /** Gets the value type of the struct field */
  @Meta(Return, NS_SYSTEM_STRING)
  static async getaccessvaluetype(
    @Meta(ArgName, 'nodes')
    @Meta(SchemaType, `${NS_SYSTEM_SCHEMA_APP_WORKFLOW}.nodes`)
    @Meta(Require, true)
    nodes: AppWorkflowNodeSchema[] = [],

    @Meta(ArgName, 'path')
    @Meta(SchemaType, NS_SYSTEM_STRING)
    path: string
  ): Promise<string | undefined> {
    path = path?.toLowerCase();
    if (!path) return undefined;
    const dotIndex = path.indexOf('.');
    const fieldName = dotIndex === -1 ? path : path.substring(0, dotIndex);
    const type = nodes?.find(a => a.name.toLowerCase() === fieldName)?.type;
    const valueType = type ? (await getNodeType(type) as WorkflowType)?.payload : undefined;
    return dotIndex === -1 ? valueType?.name : valueType?.getAccessValueType(path.substring(dotIndex + 1))?.name;
  }

}
