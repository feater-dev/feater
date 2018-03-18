export const createProjectDtoJsonSchema = {
    type: 'object',
    required: [
        'name',
    ],
    properties: {
        name: {
            type: 'string',
        },
        mainRepository: {
            type: 'object',
            required: [
                'name',
            ],
            properties: {
                name: {
                    type: 'string',
                },
                basePath: {
                    type: [
                        'null',
                        'string',
                    ],
                },
            },
        },
    },
    additionalProperties: false,
};
