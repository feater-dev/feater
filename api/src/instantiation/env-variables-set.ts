class EnvVariablesSetItem {

    constructor(
        readonly key: string,
        readonly value: string,
    ) {}

}

export class EnvVariablesSet {

    private readonly items: EnvVariablesSetItem[];

    constructor() {
        this.items = [];
    }

    add(key: string, value: string) {
        this.items.push(new EnvVariablesSetItem(key, value));
    }

    static merge(...sets: EnvVariablesSet[]): EnvVariablesSet {
        const merged = new EnvVariablesSet();
        for (const set of sets) {
            for (const item of set.items) {
                merged.add(item.key, item.value);
            }
        }

        return merged;
    }

    toList(): EnvVariablesSetItem[] {
        return this.items.slice();
    }

    toMap(): {[key: string]: string} {
        const map = {};
        for (const item of this.items) {
            map[item.key] = item.value;
        }

        return map;
    }

    toString(): string {
        const list = [];
        for (const item of this.items) {
            list.push(`${item.key}=${item.value}`);
        }

        return list.join(' ');
    }

}
