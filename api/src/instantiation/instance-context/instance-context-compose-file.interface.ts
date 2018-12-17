export interface InstanceContextComposeFileInterface {
    sourceId: string;
    envDirRelativePath: string;
    composeFileRelativePaths: string[];
    arguments: string[];
    workingDirectory: string;
    envVariables: {
        name: string;
        value: string;
    }[];
}
