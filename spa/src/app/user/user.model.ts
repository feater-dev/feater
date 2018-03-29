export interface User {
    _id: string;
    name: string;
    googleProfile: UserGoogleProfile,
    githubProfile: UserGithubProfile,
}

export interface UserGoogleProfile {
    emailAddress: string;
}

export interface UserGithubProfile {
    username: string;
}
