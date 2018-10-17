export interface GetContainerIdsCommandResultServiceContainerIdInterface {
    readonly serviceId: string;
    readonly containerId: string;
}

export interface GetContainerIdsCommandResultInterface {
    readonly serviceContainerIds: GetContainerIdsCommandResultServiceContainerIdInterface[];
}
