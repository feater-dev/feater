import gql from 'graphql-tag';


export const getuserListQueryGql = gql`
    query {
        users {
            id
            name
            githubProfile {
                username
            }
            googleProfile {
                emailAddress
            }
        }
    }
`;

export interface GetUserListQueryUsersFieldItemInterface {
    id: number;
    name: string;
    githubProfile: {
        username: string;
    };
    googleProfile: {
        emailAddress: string;
    };
}

export interface GetUserListQueryInterface {
    users: GetUserListQueryUsersFieldItemInterface[];
}
