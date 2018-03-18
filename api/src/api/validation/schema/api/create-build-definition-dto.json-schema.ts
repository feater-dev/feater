export const createBuildDefinitionDtoJsonSchema  = {
    type: 'object',
    required: [
        'projectId',
        'name',
        'config',
    ],
    properties: {
        projectId: {
            type: 'string',
            pattern: '^[a-f\\d]{24}$',
        },
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
        },
        config: {
            type: 'object',
        },
    },
    additionalProperties: false,
};
