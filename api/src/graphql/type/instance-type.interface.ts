export interface InstanceTypeInterface {
    readonly id: string;
    readonly name: string;
    readonly definitionId: string;
    readonly services: any;
    readonly summaryItems: any;
    readonly envVariables: any;
    readonly proxiedPorts: any;
}
