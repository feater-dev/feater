import {Schema} from 'mongoose';

const InstanceServiceSchema = new Schema(
    {
        id: String,
        containerNamePrefix: String,
        containerId: String, // TODO Probably should be determined on runtime.
        ipAddress: String, // TODO Probably should be determined on runtime.
    }, {
        _id: false, // TODO Apply for other schemas.
    });

const InstanceEnvVariableSchema = new Schema({
    _id: false,
    name: String,
    value: String,
});

const InstanceProxiedPortSchema = new Schema({
    _id: false,
    serviceId: String,
    id: String,
    name: String,
    port: Number,
    proxyDomain: String,
});

const InstanceSummaryItemSchema = new Schema({
    _id: false,
    name: String,
    text: String,
});

export const InstanceSchema = new Schema({
    definitionId: String,
    hash: String,
    name: String,
    services: [InstanceServiceSchema],
    envVariables: [InstanceEnvVariableSchema],
    proxiedPorts: [InstanceProxiedPortSchema],
    summaryItems: [InstanceSummaryItemSchema],
    createdAt: Date,
    updatedAt: Date,
    builtAt: Date,
});
