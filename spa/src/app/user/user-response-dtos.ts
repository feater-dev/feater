export interface GetUserResponseDto {
    id: string;
    name: string;
    googleProfile?: {
        emailAddress: string;
    };
    githubProfile?: {
        username: string;
    };
}
