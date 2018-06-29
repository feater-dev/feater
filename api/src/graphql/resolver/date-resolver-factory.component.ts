import {Component} from '@nestjs/common';

@Component()
export class DateResolverFactory {
    public getResolver(dateExtractor?: (obj: any) => Date): (obj: any) => Promise<string> {
        return async (obj: any): Promise<string> => {
            return dateExtractor(obj).toISOString();
        };
    }
}
