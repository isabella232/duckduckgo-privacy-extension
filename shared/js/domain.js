class Domain {
    constructor(name) {
        this.name = name;
        this.pagesViewed = 0;
        this.trackers = new Set([]);
    };

    addTrackers(trackers) {
        const newSet = new Set(trackers);
        this.trackers = new Set([this.trackers, newSet]);
    };

    incrementPagesViewed(){
        this.pagesViewed += 1;
    };

    get(property) {
        return this[property];
    };

    set(property, val) {
        this[property] = val;
    }
}
