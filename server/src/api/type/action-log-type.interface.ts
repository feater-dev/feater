export interface ActionLogTypeInterface {
    id: string;
    actionId: string;
    actionType: string;
    actionName: string;
    createdAt: string;
    completedAt?: string;
    failedAt?: string;
}
