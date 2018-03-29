export class FindAllUserResponseDto {
    readonly _id: string;
    readonly name: string;
    readonly googleProfile: FindAllUserGoogleProfileResponseDto;
    readonly githubProfile: FindAllUserGithubProfileResponseDto;
}

export class FindAllUserGoogleProfileResponseDto {
    readonly emailAddress: string;
}

export class FindAllUserGithubProfileResponseDto {
    readonly username: string;
}
