class EnvVariablesSetItem {

    constructor(
        readonly name: string,
        readonly value: string,
    ) {}

}

export class EnvVariablesSet {

    private items: EnvVariablesSetItem[];

    constructor() {
        this.items = [];
    }

    static merge(...sets: EnvVariablesSet[]): EnvVariablesSet {
        const merged = new EnvVariablesSet();
        for (const set of sets) {
            for (const item of set.items) {
                merged.add(item.name, item.value);
            }
        }

        return merged;
    }

    static fromList(list: {name: string, value: string}[]): EnvVariablesSet {
        const set = new EnvVariablesSet();
        for (const {name, value} of list) {
            set.add(name, value);
        }

        return set;
    }

    add(name: string, value: string) {
        this.items.push(new EnvVariablesSetItem(name, value));
    }

    toList(): EnvVariablesSetItem[] {
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

    merge(...sets: EnvVariablesSet[]): EnvVariablesSet {
        return EnvVariablesSet.merge(...[this, ...sets]);
    }

}
