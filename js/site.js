class Score {
    constructor() {
        this.scoreIndex = 0;
        this.scoreExplination = {};
    }

    get() {
        let siteScores = ['A', 'B', 'C', 'D', 'F'];
        // return corresponding score or lowest score
        return siteScores[this.scoreIndex] || siteScores[siteScores.length - 1];
    };

    update(event) {
        let topTrackers = {Google:true, Facebook:true, Twitter:true, Amazon:true, AdNexus:true, Oracle:true}

        if (event.noHTTPS) { 
            this.scoreIndex++
            this.scoreExplination['noHTTPS'] = true;
        }
        else if (event.trackerBlocked) {
         
            if (topTrackers[event.trackerBlocked.parentCompany]) {
                this.scoreIndex++
                this.incrementExplinationCount('topTracker')
            }

            // +1 for first tracker and for every additional 10
            if (event.total === 1 || ((event.totalBlocked % 10) === 0)){
                this.scoreIndex++
                this.incrementExplinationCount('totalTrackers')
            }

        }
    };
    
    incrementExplinationCount(key) {
        this.scoreExplination[key] ? this.scoreExplination[key]++ : this.scoreExplination[key] = 1
    };
}

class Site{
    constructor(domain) {
        this.domain = domain,
        this.trackers = [],
        this.score = new Score();

        // whitelist only HTTPS upgrades
        this.HTTPSwhitelisted = false;

        // whitelist all privacy features
        this.whitelisted = false;

        this.setWhitelistStatusFromGlobal(domain);
    }

    setWhitelisted(name, value){ 
        this[name] = value;
        this.setGlobalWhitelist(name);
    };

    /*
     * Store an updated whitelist value in settings
     */
    setGlobalWhitelist(name){
        let globalwhitelist = settings.getSetting(name) || {};

        if(this[name]){
            globalwhitelist[this.domain] = true;
        }
        else {
            delete globalwhitelist[this.domain];
        }

        settings.updateSetting(name, globalwhitelist);
    };

    /*
     * Send message to the popup to rerender the whitelist
     */
    notifyWhitelistChanged(){
        chrome.runtime.sendMessage({'whitelistChanged': true});
    };

    isWhiteListed(){ return this.whitelisted };
    
    addTracker(tracker){ 
        if(this.trackers.indexOf(tracker.url) === -1){
            this.trackers.push(tracker.url);
            this.score.update({trackerBlocked: tracker, totalBlocked: this.trackers.length});
        }
    };

    /*
     * When site objects are created we check the stored whitelists
     * and set the new site whitelist statuses 
     */
    setWhitelistStatusFromGlobal(domain){
        let globalwhitelists = ['whitelisted', 'HTTPSwhitelisted'];

        globalwhitelists.map((name) => {
            let list = settings.getSetting(name) || {};
            this.setWhitelisted(name, list[this.domain]);
        }); 
    };

    /*
     * specialDomain
     *
     * determine if domain is a special page
     *
     * returns: a useable special page description string.
     *          or false if not a special page.
     */
    specialDomain() {
        if (this.domain === 'extensions')
            return "extensions";

        if (this.domain === chrome.runtime.id)
            return "options";

        if (this.domain === 'newtab')
            return "new tab";

        return false;
    }
}
