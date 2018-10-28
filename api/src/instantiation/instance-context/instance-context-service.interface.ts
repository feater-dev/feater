export interface InstanceContextServiceInterface {
    readonly id: string;
    readonly containerNamePrefix: string;
    containerId?: string;
    ipAddress?: string;
}
