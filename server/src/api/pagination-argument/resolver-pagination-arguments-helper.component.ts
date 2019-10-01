import { Injectable } from '@nestjs/common';

@Injectable()
export class ResolverPaginationArgumentsHelper {
    protected readonly defaultLimit = 99999;
    protected readonly maximalLimit = 99999;

    getLimit(limit?: number): number {
        return Math.min(limit || this.defaultLimit, this.maximalLimit);
    }

    getOffset(offset?: number): number {
        return offset || 0;
    }

    getSort(defaultSortKey: string, sortMap: object, sortKey?: string): object {
        if (!sortKey) {
            sortKey = defaultSortKey;
        }
        if (!sortMap[sortKey]) {
            throw new Error('Invalid sort key.');
        }

        return sortMap[sortKey];
    }
}
