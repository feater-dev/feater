class SummaryItemsSetItem {

    constructor(
        readonly key: string,
        readonly value: string,
    ) {}

}

export class SummaryItemsSet {

    private readonly items: SummaryItemsSetItem[];

    constructor() {
        this.items = [];
    }

    add(key: string, value: string) {
        this.items.push(new SummaryItemsSetItem(key, value));
    }

    static merge(...sets: SummaryItemsSet[]): SummaryItemsSet {
        const merged = new SummaryItemsSet();
        for (const set of sets) {
            for (const item of set.items) {
                merged.add(item.key, item.value);
            }
        }

        return merged;
    }

    toMap(): object {
        const map = {};
        for (const item of this.items) {
            map[item.key] = item.value;
        }

        return map;
    }

}
