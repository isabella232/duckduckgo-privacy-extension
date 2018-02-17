class Domain {
    constructor(name) {
        this.name = name;
        this.trackers = new Set([]);
    };

    addTrackers(trackers) {
        const newSet = new Set(trackers);
        this.trackers = new Set([this.trackers, newSet]);
    };

    get(property) {
        return this[property];
    };

    set(property, val) {
        this[property] = val;
    }
}
