import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'elapsedTime'})
export class ElapsedTimePipe implements PipeTransform {
    transform(startAndEndDateString: {start: string, end: string}): string {
        if (!startAndEndDateString.start || !startAndEndDateString.end) {
            return '...';
        }
        const startToEndDiff = moment(startAndEndDateString.end).diff(startAndEndDateString.start);
        const seconds = moment.duration(startToEndDiff).asSeconds();

        if (seconds < 60) {
          return `${seconds.toFixed(2)}s`;
        }

        return moment(startToEndDiff).format('m[m] s[s]');
    }
}
