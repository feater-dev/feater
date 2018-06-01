export class FindOneDefinitionResponseDto {
    readonly _id: string;
    readonly name: string;
    readonly config: any;
    readonly project: {
        readonly _id: string;
        readonly name: string;
    };
}
