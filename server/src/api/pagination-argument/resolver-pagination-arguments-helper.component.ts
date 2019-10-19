import { Injectable } from '@nestjs/common';

@Injectable()
export class ResolverPaginationArgumentsHelper {
    private readonly maximalLimit = 999999;

    getLimit(limit?: number): number {
        return Math.min(limit || this.maximalLimit, this.maximalLimit);
    }

    getOffset(offset?: number): number {
        return offset || 0;
    }

    getSort(
        defaultSortKey: string,
        sortMap: unknown,
        sortKey?: string,
    ): unknown {
        if (!sortKey) {
            sortKey = defaultSortKey;
        }
        if (!sortMap[sortKey]) {
            throw new Error('Invalid sort key.');
        }

        return sortMap[sortKey];
    }
}
