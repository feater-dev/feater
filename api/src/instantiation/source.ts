import * as path from 'path';
import {Build} from './build';

export class Source {

    resolvedReference: string;
    relativePath: string;
    zipFileUrl: string;
    zipFileFullPath: string;

    constructor(
        readonly id: string,
        readonly build: Build,
        readonly config: any,
    ) {
        this.build.addSource(this);
    }

    get fullBuildPath(): string {
        return path.join(this.build.fullBuildPath, this.relativePath);
    }

    get fullBuildHostPath(): string {
        return path.join(this.build.fullBuildHostPath, this.relativePath);
    }

}
