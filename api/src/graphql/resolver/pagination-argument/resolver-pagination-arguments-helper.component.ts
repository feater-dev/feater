import {Component} from '@nestjs/common';

@Component()
export class ResolverPaginationArgumentsHelper {

    protected readonly defaultLimit = 20;
    protected readonly maximalLimit = 100;

    public getLimit(limit?: number): number {
        return Math.min(limit || this.defaultLimit, this.maximalLimit);
    }

    public getOffset(offset?: number): number {
        return offset || 0;
    }

    public getSort(defaultSortKey: string, sortMap: object, sortKey?: string): object {
        if (!sortMap[sortKey]) {
            throw new Error('Invalid sort key.');
        }

        return sortMap[sortKey];
    }

}
