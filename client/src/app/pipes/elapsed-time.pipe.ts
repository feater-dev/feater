import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'elapsedTime'})
export class ElapsedTimePipe implements PipeTransform {
    transform(startAndEndDateString: {start: string, end: string}): string {
        if (!startAndEndDateString.start || !startAndEndDateString.end) {
            return '...';
        }
        const asSeconds = moment.duration(moment(startAndEndDateString.end).diff(startAndEndDateString.start)).asSeconds();

        return `${asSeconds.toFixed(2)}s`;
    }
}
