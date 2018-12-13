export interface VariablesContextInterface {
    instanceId?: string;
    instanceHash?: string;
    sources: {
        id?: string;
    }[];
    volumes: {
        id?: string;
    }[];
    proxiedPorts: {
        id?: string,
    }[];
    services: {
        id?: string,
        containerId?: string;
    }[];
}
