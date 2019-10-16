export interface CommandLogTypeInterface {
    readonly id: string;
    readonly description: string;
    readonly createdAt: Date;
    readonly completedAt: Date;
    readonly failedAt: Date;
    readonly entries: {
        level: string;
        message: string;
    }[];
}
