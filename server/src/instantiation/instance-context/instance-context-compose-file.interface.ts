export interface InstanceContextComposeFileInterface {
    sourceId: string;
    envDirRelativePath: string;
    composeFileRelativePaths: string[];
    dockerVolumeName?: string;
}
