export interface GetBuildDefinitionResponseDto {
    _id: string;
    name: string;
    project: {
        _id: string;
        name: string;
    };
    config: Object;
}

export interface AddBuildDefinitionResponseDto {
    id: string;
}
