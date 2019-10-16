export interface ActionLogTypeInterface {
    id: string;
    actionId: string;
    actionType: string;
    actionName: string;
    createdAt: Date;
    completedAt?: Date;
    failedAt?: Date;
}
