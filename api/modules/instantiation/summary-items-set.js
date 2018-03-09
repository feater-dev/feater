class SummaryItemsSet {

    constructor() {
        this.items = [];
    }

    add(name, value) {
        this.items.push({ name, value });
    }

}

module.exports = {
    SummaryItemsSet
};