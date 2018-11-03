class FeaterVariablesSetItem {

    constructor(
        readonly name: string,
        readonly value: string,
    ) {}

}

export class FeaterVariablesSet {

    private readonly items: FeaterVariablesSetItem[];

    constructor() {
        this.items = [];
    }

    static fromList(list: {name: string, value: string}[]): FeaterVariablesSet {
        const set = new FeaterVariablesSet();
        for (const {name, value} of list) {
            set.add(name, value);
        }

        return set;
    }

    static merge(...sets: FeaterVariablesSet[]): FeaterVariablesSet {
        const merged = new FeaterVariablesSet();
        for (const set of sets) {
            for (const item of set.items) {
                merged.add(item.name, item.value);
            }
        }

        return merged;
    }

    isEmpty(): boolean {
        return 0 === this.items.length;
    }

    add(name: string, value: string) {
        this.items.push(new FeaterVariablesSetItem(name, value));
    }

    toList(): FeaterVariablesSetItem[] {
        return this.items.slice();
    }

    toMap(): {[name: string]: string} {
        const map = {};
        for (const item of this.items) {
            map[item.name] = item.value;
        }

        return map;
    }

    toString(): string {
        const list = [];
        for (const item of this.items) {
            list.push(`${item.name}=${item.value}`);
        }

        return list.join(' ');
    }

    merge(...sets: FeaterVariablesSet[]): FeaterVariablesSet {
        return FeaterVariablesSet.merge(...[this, ...sets]);
    }

}
