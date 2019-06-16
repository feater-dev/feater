// TODO Refactor and remove.

import {Injectable} from '@nestjs/common';

@Injectable()
export class DateResolverFactory {
    public getDateResolver(dateExtractor?: (obj: any) => Date): (obj: any) => Promise<string> {
        return async (obj: any): Promise<string> => {
            const date = dateExtractor(obj);

            return date ? date.toISOString() : null;
        };
    }

    public getTimestampResolver(timestampExtractor?: (obj: any) => number): (obj: any) => Promise<string> {
        return async (obj: any): Promise<string> => {
            const timestamp = timestampExtractor(obj);
            if (!timestamp) {
                return null;
            }
            const date = new Date(timestampExtractor(obj));

            return date.toISOString();
        };
    }
}
