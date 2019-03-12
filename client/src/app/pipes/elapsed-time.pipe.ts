import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'elapsedTime'})
export class ElapsedTimePipe implements PipeTransform {
    transform(startAndEndDateString: {start: string, end: string}): string {
        if (!startAndEndDateString.start || !startAndEndDateString.end) {
            return '...';
        }
        const startToEndDuration = moment.duration(moment(startAndEndDateString.end).diff(startAndEndDateString.start));
        const diffInSeconds = startToEndDuration.asSeconds();
        const seconds = startToEndDuration.seconds();
        const minutes = startToEndDuration.minutes();

        return diffInSeconds > 60
          ? `${minutes}m ${seconds}s`
          : `${seconds.toFixed(2)}s`;
    }
}
