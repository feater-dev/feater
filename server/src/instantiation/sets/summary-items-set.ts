class SummaryItemsSetItem {
    constructor(readonly name: string, readonly value: string) {}
}

export class SummaryItemsSet {
    private readonly items: SummaryItemsSetItem[];

    constructor() {
        this.items = [];
    }

    static merge(...sets: SummaryItemsSet[]): SummaryItemsSet {
        const merged = new SummaryItemsSet();
        for (const set of sets) {
            for (const item of set.items) {
                merged.add(item.name, item.value);
            }
        }

        return merged;
    }

    static fromList(list: { name: string; value: string }[]): SummaryItemsSet {
        const set = new SummaryItemsSet();
        for (const { name, value } of list) {
            set.add(name, value);
        }

        return set;
    }

    add(name: string, value: string) {
        this.items.push(new SummaryItemsSetItem(name, value));
    }

    toList(): SummaryItemsSetItem[] {
        return this.items.slice();
    }

    toMap(): { [name: string]: string } {
        const map = {};
        for (const item of this.items) {
            map[item.name] = item.value;
        }

        return map;
    }

    merge(...sets: SummaryItemsSet[]): SummaryItemsSet {
        return SummaryItemsSet.merge(...[this, ...sets]);
    }
}
