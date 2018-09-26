export interface DeployKeyTypeInterface {
    readonly id: string;
    readonly sshCloneUrl: string;
    readonly publicKey: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
