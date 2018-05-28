export interface BeforeBuildTaskTypeInterface {
    readonly type: string;
}

export interface CopyBeforeBuildTaskTypeInterface extends BeforeBuildTaskTypeInterface {
    readonly sourceRelativePath: string;
    readonly destinationRelativePath: string;
}

export interface InterpolateBeforeBuildTaskTypeInterface extends BeforeBuildTaskTypeInterface {
    readonly relativePath: string;
}
