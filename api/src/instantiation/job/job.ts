import {Build} from '../build';
import {Source} from '../source';

export interface JobInterface {}

export interface BuildJobInterface extends JobInterface {
    readonly build: Build;
}

export interface SourceJobInterface extends JobInterface {
    readonly source: Source;
}
