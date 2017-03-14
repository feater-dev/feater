export interface ProjectReference {
    _id: string;
    name: string;
}

export interface BuildDefinition {
    _id: string;
    name: string;
    project: ProjectReference;
    config: Object;
}
