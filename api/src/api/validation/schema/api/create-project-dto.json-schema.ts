export const createProjectDtoJsonSchema = {
    type: 'object',
    required: [
        'name',
    ],
    properties: {
        name: {
            type: 'string',
        },
    },
    additionalProperties: false,
};
