import {Injectable} from '@nestjs/common';

@Injectable()
export class DateConverter {
    public getISODate(date: Date): string {
        return date ? date.toISOString() : null;
    }
}
