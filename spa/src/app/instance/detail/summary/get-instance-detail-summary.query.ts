import gql from 'graphql-tag';

export const getInstanceDetailSummaryQueryGql = gql`
    query ($id: String!) {
        instance(id: $id) {
            id
            name
            definition {
                id
                name
                project {
                    id
                    name
                }
            }
            summaryItems {
                name
                value
            }
            createdAt
            updatedAt
            completedAt
            failedAt
        }
    }
`;

export interface GetInstanceDetailSummaryQueryInstanceFieldInterface {
    readonly id: string;
    readonly name: string;
    readonly definition: {
        readonly id: string;
        readonly name: string;
        readonly project: {
            readonly id: string;
            readonly name: string;
        };
    };
    readonly summaryItems: [
        {
            readonly name: string;
            readonly value: string;
        }
    ];
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly completedAt: string;
    readonly failedAt: string;
}

export interface GetInstanceDetailSummaryQueryInterface {
    instance: GetInstanceDetailSummaryQueryInstanceFieldInterface;
}
