export interface ActionExecutionContextServiceInterface {
    readonly id: string;
    readonly containerNamePrefix: string;
    containerId?: string;
    ipAddress?: string;
}
