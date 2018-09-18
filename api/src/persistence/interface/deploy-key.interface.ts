import {Document} from 'mongoose';

export interface DeployKeyInterface extends Document {
    readonly _id: string;
    readonly repositoryOwner: string;
    readonly repositoryName: string;
    readonly publicKey: string;
    readonly privateKey: string;
}
