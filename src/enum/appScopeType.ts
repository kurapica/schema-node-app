
/// <summary>
/// The application target policy type
/// </summary>
export enum AppScopeType
{
    /// <summary>
    /// Use target, the default policy
    /// </summary>
    BusinessTarget = "businessTarget",
    
    /// <summary>
    /// No target, system app
    /// </summary>
    SystemLevel = "systemLevel",
    
    /// <summary>
    /// Use context item for data isolation like tenate id, org id
    /// </summary>
    IsolationContext = "isolationContext",
}

export type AppScopeTypeValue = `${AppScopeType}`
