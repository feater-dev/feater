export class FindOneBuildInstanceResponseDto {
    readonly _id: string;
    readonly hash: string;
    readonly name: string;
    readonly buildDefinition: {
        readonly _id: string;
        readonly name: string;
        readonly config: any;
        readonly project: {
            readonly _id: string;
            readonly name: string;
        };
    };
}
