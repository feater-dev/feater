import {Schema} from 'mongoose';
import {EnvVariablesSet} from '../../instantiation/sets/env-variables-set';

const InstanceServiceSchema = new Schema(
    {
        id: String,
        containerNamePrefix: String,
        containerId: String,
        ipAddress: String,
    }, {
        _id: false,
    },
);

const InstanceEnvVariableSchema = new Schema(
    {
        name: String,
        value: String,
    }, {
        _id: false,
    },
);

const InstanceProxiedPortSchema = new Schema(
    {
        serviceId: String,
        id: String,
        name: String,
        port: Number,
        domain: String,
        nginxConfig: String,
    }, {
        _id: false,
    },
);

const InstanceSummaryItemSchema = new Schema(
    {
        name: String,
        value: String,
    }, {
        _id: false,
    },
);

const InstanceComposeFileSchema = new Schema(
    {
        sourceId: String,
        envDirRelativePath: String,
        composeFileRelativePaths: [String],
        args: [String],
        absoluteGuestEnvDirPath: String,
        envVariables: [InstanceEnvVariableSchema],
    }, {
        _id: false,
    },
);

const InstanceSourceReferenceSchema = new Schema(
    {
        type: String,
        name: String,
    }, {
        _id: false,
    },
);

const InstanceSourceVolumeSchema = new Schema(
    {
        name: String,
    }, {
        _id: false,
    },
);

const InstanceSourceSchema = new Schema(
    {
        id: String,
        cloneUrl: String,
        reference: InstanceSourceReferenceSchema,
        // TODO Add paths.
        volume: InstanceSourceVolumeSchema,
    }, {
        _id: false,
    },
);

export const InstanceSchema = new Schema({
    definitionId: String,
    hash: String,
    name: String,
    sources: [InstanceSourceSchema],
    services: [InstanceServiceSchema],
    composeFiles: [InstanceComposeFileSchema],
    envVariables: [InstanceEnvVariableSchema],
    proxiedPorts: [InstanceProxiedPortSchema],
    summaryItems: [InstanceSummaryItemSchema],
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date,
    failedAt: Date,
});
