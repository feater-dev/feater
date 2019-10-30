export interface ActionExecutionContextAfterBuildTaskInterface {
    readonly type: string;
    readonly id?: string;
    readonly dependsOn?: string[];
}
