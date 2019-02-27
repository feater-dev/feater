export interface ParseDockerComposeCommandResultServiceInterface {
    readonly id: string;
    readonly containerNamePrefix: string;
}

export interface ParseDockerComposeCommandResultInterface {
    readonly services: ParseDockerComposeCommandResultServiceInterface[];
}
