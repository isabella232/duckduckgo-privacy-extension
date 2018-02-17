class Domain {
    constructor(name) {
        this.name = name;
        this.trackers = new Set([]);
    };

    addTrackers(tracker) {
        this.trackers.add(tracker);
    };

    get(property) {
        return this[property];
    };

    set(property, val) {
        this[property] = val;
    }
}
