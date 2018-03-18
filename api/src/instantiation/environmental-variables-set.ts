class EnvironmentalVariablesSetItem {

    constructor(
        readonly key: string,
        readonly value: string,
    ) {}

}

export class EnvironmentalVariablesSet {

    private readonly items: EnvironmentalVariablesSetItem[];

    constructor() {
        this.items = [];
    }

    add(key: string, value: string) {
        this.items.push(new EnvironmentalVariablesSetItem(key, value));
    }

    static merge(...sets: EnvironmentalVariablesSet[]): EnvironmentalVariablesSet {
        const merged = new EnvironmentalVariablesSet();
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
