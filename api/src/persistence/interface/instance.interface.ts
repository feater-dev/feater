import {Document} from 'mongoose';
import {AbsolutePathsInterface} from '../../instantiation/helper/absolute-paths.interface';
import {InstanceContextBeforeBuildTaskInterface} from '../../instantiation/instance-context/before-build/instance-context-before-build-task.interface';

export interface InstanceInterface extends Document {
    readonly _id: string;
    hash: string;
    definitionId: string;
    name: string;
    sources: {
        id: string;
        cloneUrl: string;
        reference: {
            type: string;
            name: string;
        };
        beforeBuildTasks: InstanceContextBeforeBuildTaskInterface[];
        paths?: {
            dir?: AbsolutePathsInterface,
        };
        volume?: {
            name?: string;
        };
    }[];
    services: {
        id: string;
        containerNamePrefix: string;
        containerId?: string;
        ipAddress?: string;
    }[];
    summaryItems: {
        name: string;
        value: string;
    }[];
    envVariables: {
        name: string;
        value: string;
    }[];
    proxiedPorts: {
        id: string;
        name: string;
        serviceId: string;
        port: number;
        domain?: string;
        nginxConfig?: string;
    }[];
    composeFiles: {
        sourceId: string;
        envDirRelativePath: string;
        composeFileRelativePaths: string[];
        args?: string[];
        absoluteGuestEnvDirPath?: string;
        envVariables?: {
            name: string;
            value: string;
        }[];
    }[];
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
    failedAt: Date;
}
