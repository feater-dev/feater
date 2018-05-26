import {JobInterface} from './job';

export interface JobExecutorInterface {

    supports(
        job: JobInterface,
    ): boolean;

    execute(
        job: JobInterface,
        data: any,
    ): Promise<any>;

}
