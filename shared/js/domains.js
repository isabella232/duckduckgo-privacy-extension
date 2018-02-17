class Domain{
    constructor(name) {
        this.name = name;
        this.visits = 0;
        this.trackers = new Set([]);
    };

    incrementVisits(){
        this.visits += 1;
    };

    mergeTrackers(trackers){
        let latest = new Set(trackers);
        this.trackers = new Set([latest, this.trackers]);
    };

    get(property){
        return this[property];
    };

    set(property, val){
        this[property] = val;
    }
}


var Domains = (() => {
    var domainContainer = {}
    var utils = require('utils')
    var storageName = 'domainData'
    var totalDomains = 0
    var totalDomainsWithTrackers = 0
    var lastStatsResetDate = null

    function sortByVisits (a, b) {
        return domainContainer[b].visits - domainContainer[a].visits
    }

    function sortByTrackers (a, b) {
        return domainContainer[b].trackers.length - domainContainer[a].trackers.length
    }

    return {
        get: (name) => { return domainContainer[name] },

        getTotalPages: () => { return totalDomains },

        add: (name, trackers) => {
            if (!domainContainer[name]) {
                domainContainer[name] = new Domain(name)
            }
            domainContainer[name].incrementVisits()
            domainContainer[name].mergeTrackers(trackers)
            return domainContainer[name]
        },

        all: () => { return Object.keys(domainContainer) },

        getTopVisited: (n) => {
            var topBlockedData = [];
            domainContainer.sort(function(a, b) {
                return b.visits - a.visits
            }).slice(n).forEach((c) => {
                topBlockedData.push({
                    name: c.name,
                    count: c.visits
                })
            })

            return topBlockedData
        },

        getTopByTrackers: (n) => {
            var topTrackedData = []
            domainContainer.sort(function(a, b) {
                return b.trackers.length - a.trackers.length
            }).slice(n).forEach((c) => {
                topTrackedData.push({
                    name: c.name,
                    trackers: c.trackers.length
                })
            })

            return {
                topBlocked: topTrackedData,
                totalDomains: totalDomains,
                lastStatsResetDate: lastStatsResetDate
            }
        },

        setTotalDomainsFromStorage: (n) => {
            if (n) totalDomains = n
        },

        setTotalDomainsWithTrackersFromStorage: (n) => {
            if (n) totalDomainsWithTrackers = n
        },

        resetData: () => {
            domainContainer = {}
            topBlocked.clear()
            totalDomains = 0
            totalDomainsWithTrackers = 0
            lastStatsResetDate = Date.now()
            Domains.syncToStorage()
        },

        getLastResetDate: ()  => lastStatsResetDate,

        incrementTotalPages: () => {
            totalDomains += 1
            Domains.syncToStorage()
        },

        incrementTotalPagesWithTrackers: () => {
            totalDomainsWithTrackers += 1
            Domains.syncToStorage()
        },

        syncToStorage: () => {
            var toSync = {};
            toSync[storageName] = domainContainer;
            utils.syncToStorage(toSync)
            utils.syncToStorage({'totalDomains': totalDomains})
            utils.syncToStorage({'totalDomainsWithTrackers': totalDomainsWithTrackers})
            utils.syncToStorage({'lastStatsResetDate': lastStatsResetDate})
        },

        sanitizeData: (storageData) => {
            if (storageData && storageData.hasOwnProperty('twitter')) {
              delete storageData.twitter
            }
            return storageData
        },

        buildFromStorage: () => {
            utils.getFromStorage(storageName, function (storageData) {
                // uncomment for testing
                //storageData.twitter = {count: 10, name: 'twitter', pagesSeenOn: 10}
                storageData = Domains.sanitizeData(storageData)
                for (domain in storageData) {
                    let newDomain = Domains.add(domain)
                    newDomain.set('count', storageData[domain].count || 0)
                    newDomain.set('pagesSeenOn', storageData[domain].pagesSeenOn || 0)
                }
            })

            utils.getFromStorage('totalDomains', (n) => { if (n) totalDomains = n })
            utils.getFromStorage('totalDomainsWithTrackers', (n) => { if (n) totalDomainsWithTrackers = n })
            utils.getFromStorage('lastStatsResetDate', (d) => {
                if (d) {
                    lastStatsResetDate = d
                } else {
                    // if 'lastStatsResetDate' not found, reset all data
                    // https://app.asana.com/0/0/460622849089890/f
                    Domains.resetData()
                }
            })
         }
     }
})()

Domains.buildFromStorage()

// sync data to storage when a tab finishes loading
chrome.tabs.onUpdated.addListener( (id,info) => {
    if (info.status === "complete") {
        Domains.syncToStorage()
    }
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.getTopBlocked) {
        res(Domains.getTopBlocked(req.getTopBlocked))
    } else if (req.getTopBlockedByPages) {
        res(Domains.getTopBlockedByPages(req.getTopBlockedByPages))
    } else if (req.resetTrackersData) {
        Domains.resetData()
        chrome.runtime.sendMessage({'didResetTrackersData': Domains.getLastResetDate()})
        res()
    }
    return true
})
