import { Injectable } from '@nestjs/common';

@Injectable()
export class DateConverter {
    convertDate(date: Date): string {
        return date ? date.toISOString() : null;
    }
}
