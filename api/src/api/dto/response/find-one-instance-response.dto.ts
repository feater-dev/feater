export class FindOneInstanceResponseDto {
    readonly _id: string;
    readonly hash: string;
    readonly name: string;
    readonly definition: {
        readonly _id: string;
        readonly name: string;
        readonly config: any;
        readonly project: {
            readonly _id: string;
            readonly name: string;
        };
    };
    readonly services: any;
    readonly summaryItems: {
        readonly key: string;
        readonly value: string;
    }[];
    readonly environmentalVariables: {
        readonly name: string;
        readonly value: string;
    }[];
}
