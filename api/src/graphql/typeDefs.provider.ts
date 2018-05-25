export const typeDefsProvider = {
    provide: 'TypeDefsProvider',
    useValue: `
        scalar JSON

        schema {
            query: Query
        }

        type Query {
            hello: String!
            projects: [Project!]!
            buildDefinitions: [BuildDefinition!]!
            buildInstances: [BuildInstance!]!
        }

        type Project {
            _id: String!
            name: String!
            buildDefinitions: [BuildDefinition!]!
        }

        type BuildDefinition {
            _id: String!
            name: String!
            project: Project!
            buildInstances: [BuildInstance!]!
        }

        type BuildInstance {
            _id: String!
            name: String!
            buildDefinition: BuildDefinition!
        }
    `,
};
