export interface InstanceContextAfterBuildTaskInterface {
    readonly type: string;
    readonly id?: string;
    readonly dependsOn?: string[];
}
