class Domain {
    constructor(name) {
        this.name = name;
        this.pagesViewed = 0;
        this.trackers = {};
    };

    addTrackers(trackers) {
        for (var t in trackers) {
            this.trackers[trackers[t]] = 1
        }
    };

    incrementPagesViewed(){
        this.pagesViewed += 1;
    };

    size() {
        return Object.keys(this.trackers).length
    }
    get(property) {
        return this[property];
    };

    set(property, val) {
        this[property] = val;
    }
}
