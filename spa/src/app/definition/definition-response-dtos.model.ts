export interface GetDefinitionResponseDto {
    id: string;
    name: string;
    project: {
        id: string;
        name: string;
    };
    config: Object;
}
