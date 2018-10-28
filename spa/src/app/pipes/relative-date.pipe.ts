import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'relativeDate'})
export class RelativeDatePipe implements PipeTransform {
    transform(dateString: string): string {
        if (!dateString) {
            return '';
        }

        return moment(dateString).fromNow();
    }
}
