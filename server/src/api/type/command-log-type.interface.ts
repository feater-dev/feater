export interface CommandLogTypeInterface {
    readonly id: string;
    readonly description: string;
    readonly createdAt: string;
    readonly completedAt: string;
    readonly failedAt: string;
    readonly entries: {
        level: string;
        message: string;
    }[];
}
