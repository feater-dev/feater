import * as _ from 'lodash';
import {Source} from '../instantiation/source';
import {BuildJobLogger} from './build-job-logger';
import {BaseLogger} from './base-logger';

export class SourceJobLogger extends BuildJobLogger {

    protected readonly source: Source;

    constructor(
        baseLogger: BaseLogger,
        source: Source,
    ) {
        super(baseLogger, source.build);
        this.source = source;
    }

    protected getExtendedMeta(meta: object): object {
        return _.extend(
            {},
            super.getExtendedMeta(meta),
            {
                source: {
                    id: this.source.id,
                },
            },
        );
    }

}
