export interface GetDefinitionResponseDto {
    _id: string;
    name: string;
    project: {
        _id: string;
        name: string;
    };
    config: Object;
}
