export const createBuildInstanceDtoJsonSchema = {
    type: 'object',
    required: [
        'buildDefinitionId',
        'hash',
        'name',
    ],
    properties: {
        buildDefinitionId: {
            type: 'string',
            pattern: '^[a-f\\d]{24}$',
        },
        hash: {
            type: 'string',
            minLength: 1,
        },
        name: {
            type: 'string',
            minLength: 1,
        },
    },
    additionalProperties: false,
};
