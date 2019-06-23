export interface InstanceContextProxiedPortInterface {
    readonly id: string;
    readonly name: string;
    readonly serviceId: string;
    readonly port: number;
    domain?: string;
    nginxConfigTemplate?: string;
    nginxConfig?: string;
}
