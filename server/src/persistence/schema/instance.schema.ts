import { Schema } from 'mongoose';

const InstanceServiceSchema = new Schema(
    {
        id: String,
        containerNamePrefix: String,
        containerId: String,
        ipAddress: String,
    },
    {
        _id: false,
        strict: true,
    },
);

const InstanceAssetVolumeSchema = new Schema(
    {
        id: String,
        dockerVolumeName: String,
    },
    {
        _id: false,
        strict: true,
    },
);

const InstanceEnvVariableSchema = new Schema(
    {
        name: String,
        value: String,
    },
    {
        _id: false,
        strict: true,
    },
);

const InstanceFeaterVariableSchema = new Schema(
    {
        name: String,
        value: String,
    },
    {
        _id: false,
        strict: true,
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
    },
    {
        _id: false,
        strict: true,
    },
);

const InstanceSummaryItemSchema = new Schema(
    {
        name: String,
        value: String,
    },
    {
        _id: false,
        strict: true,
    },
);

const InstanceDownloadableSchema = new Schema(
    {
        id: String,
        name: String,
        serviceId: String,
        absolutePath: String,
    },
    {
        _id: false,
        strict: true,
    },
);

export const InstanceSchema = new Schema(
    {
        definitionId: {
            type: Schema.Types.ObjectId,
            ref: 'Definition',
        },
        hash: String,
        name: String,
        services: [InstanceServiceSchema],
        assetVolumes: [InstanceAssetVolumeSchema],
        envVariables: [InstanceEnvVariableSchema],
        featerVariables: [InstanceFeaterVariableSchema],
        proxiedPorts: [InstanceProxiedPortSchema],
        summaryItems: [InstanceSummaryItemSchema],
        downloadables: [InstanceDownloadableSchema],
        createdAt: Date,
        updatedAt: Date,
        completedAt: Date,
        failedAt: Date,
    },
    {
        strict: true,
    },
);
