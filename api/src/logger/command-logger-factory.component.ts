import {Injectable} from '@nestjs/common';
import {BaseLogger} from './base-logger';
import {BuildJobLogger} from './build-job-logger';
import {SourceJobLogger} from './source-job-logger';

@Injectable()
export class CommandLoggerFactoryComponent {

    constructor(
        private readonly baseLogger: BaseLogger,
    ) {}

    createForBuildJob(buildJob: BuildJobInterface): BuildJobLogger {
        return new BuildJobLogger(this.baseLogger, buildJob); // TODO
    }

    createForSourceJob(sourceJob: SourceJobInterface): SourceJobLogger {
        return new SourceJobLogger(this.baseLogger, sourceJob); // TODO
    }

}
