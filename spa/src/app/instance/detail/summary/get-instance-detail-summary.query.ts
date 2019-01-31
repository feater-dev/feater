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
    id: string;
    name: string;
    definition: {
        id: string;
        name: string;
        project: {
            id: string;
            name: string;
        };
    };
    summaryItems: [
        {
            name: string;
            value: string;
        }
    ];
    createdAt: string;
    updatedAt: string;
    completedAt: string;
    failedAt: string;
}

export interface GetInstanceDetailSummaryQueryInterface {
    instance: GetInstanceDetailSummaryQueryInstanceFieldInterface;
}
