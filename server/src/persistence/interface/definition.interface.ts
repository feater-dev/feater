import {Document} from 'mongoose';

export interface DefinitionInterface extends Document {
    readonly _id: string;
    projectId: string;
    name: string;
    recipeAsYaml: string;
    createdAt: Date;
    updatedAt: Date;
}
