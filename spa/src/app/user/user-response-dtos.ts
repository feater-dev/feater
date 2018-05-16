export interface GetUserResponseDto {
    _id: string;
    name: string;
    googleProfile?: {
        emailAddress: string;
    };
    githubProfile?: {
        username: string;
    };
}
