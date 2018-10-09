import {Injectable} from '@nestjs/common';

@Injectable()
export class DateResolverFactory {
    public getDateResolver(dateExtractor?: (obj: any) => Date): (obj: any) => Promise<string> {
        return async (obj: any): Promise<string> => {
            return dateExtractor(obj).toISOString();
        };
    }

    public getTimestampResolver(timestampExtractor?: (obj: any) => number): (obj: any) => Promise<string> {
        return async (obj: any): Promise<string> => {
            const date = new Date(timestampExtractor(obj));

            return date.toISOString();
        };
    }
}
