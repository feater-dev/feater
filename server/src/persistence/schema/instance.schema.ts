import {Schema} from 'mongoose';

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

export const InstanceSchema = new Schema({
    definitionId: {
        type: Schema.Types.ObjectId,
        ref: 'Definition',
    },
    hash: String,
    name: String,
    services: [InstanceServiceSchema],
    envVariables: [InstanceEnvVariableSchema],
    proxiedPorts: [InstanceProxiedPortSchema],
    summaryItems: [InstanceSummaryItemSchema],
    createdAt: Date,
    updatedAt: Date,
    completedAt: Date,
    failedAt: Date,
});
