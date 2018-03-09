class EnvironmentalVariablesSet {

    constructor() {
        this.items = [];
    }

    add(key, value) {
        this.items.push({key, value});
    }

    static merge() {
        let merged = new EnvironmentalVariablesSet();
        for (const set of arguments) {
            for (const {key, value} of set.getAll()) {
                merged.add(key, value);
            }
        }

        return merged;
    }

    getAll() {
        return this.items;
    }

    toObject() {
        let map = {};
        for (let item of this.items) {
            map[item.key] = item.value;
        }

        return map;
    }

}

module.exports = {
    EnvironmentalVariablesSet
};
