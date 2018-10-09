import {Injectable} from '@nestjs/common';
import {BuildJobInterface, SourceJobInterface} from '../instantiation/job/job';
import {BaseLogger} from './base-logger';
import {BuildJobLogger} from './build-job-logger';
import {SourceJobLogger} from './source-job-logger';

@Injectable()
export class JobLoggerFactory {

    constructor(
        private readonly baseLogger: BaseLogger,
    ) {}

    createForBuildJob(buildJob: BuildJobInterface): BuildJobLogger {
        return new BuildJobLogger(this.baseLogger, buildJob);
    }

    createForSourceJob(sourceJob: SourceJobInterface): SourceJobLogger {
        return new SourceJobLogger(this.baseLogger, sourceJob);
    }

}
