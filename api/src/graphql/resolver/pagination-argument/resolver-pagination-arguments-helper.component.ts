import {Injectable} from '@nestjs/common';

@Injectable()
export class ResolverPaginationArgumentsHelper {

    protected readonly defaultLimit = 9999;
    protected readonly maximalLimit = 9999;

    public getLimit(limit?: number): number {
        return Math.min(limit || this.defaultLimit, this.maximalLimit);
    }

    public getOffset(offset?: number): number {
        return offset || 0;
    }

    public getSort(defaultSortKey: string, sortMap: object, sortKey?: string): object {
        if (!sortKey) {
            sortKey = defaultSortKey;
        }
        if (!sortMap[sortKey]) {
            throw new Error('Invalid sort key.');
        }

        return sortMap[sortKey];
    }

}
