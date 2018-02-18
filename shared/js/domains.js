const Domains = (() => {
    let domainContainer = {};
    const utils = require('utils');
    const storageName = 'domainData';
    let totalDomains = 0;
    let totalDomainsWithTrackers = 0;
    let lastDomainResetDate = null;

    return {
        get: (name) => {
            return domainContainer[name]
        },

        getTotalDomains: () => {
            return totalDomains
        },

        getTrackersPerDomain: () => {
            return Domains.all().reduce(function (res, k) {
                return res + domainContainer[k].trackers.size;
            }, 0) / Object.keys(domainContainer).length
        },

        add: (name, trackers) => {
            if (!domainContainer[name]) {
                domainContainer[name] = new Domain(name)
            }
            if (trackers !== undefined) {
                domainContainer[name].addTrackers(trackers);
            }
            domainContainer[name].incrementPagesViewed()
            return domainContainer[name]
        },

        all: () => {
            return Object.keys(domainContainer)
        },

        getTopByTrackers: (n) => {
            const topTrackedData = [];
            Domains.all().sort(function (a, b) {
                return domainContainer[b].size() - domainContainer[a].size()
            }).slice(n).forEach((c) => {
                topTrackedData.push({
                    name: domainContainer[c].name,
                    pagesViewed: domainContainer[c].pagesViewed,
                    trackers: domainContainer[c].size()
                })
            });

            return {
                topTracked: topTrackedData,
                totalDomains: totalDomains,
                trackersPerDomain: Domains.getTrackersPerDomain(),
                lastDomainResetDate: lastDomainResetDate
            }
        },

        setTotalDomainsFromStorage: (n) => {
            if (n) totalDomains = n
        },

        setTotalDomainsWithTrackersFromStorage: (n) => {
            if (n) totalDomainsWithTrackers = n
        },

        resetData: () => {
            domainContainer = {};
            totalDomains = 0;
            totalDomainsWithTrackers = 0;
            lastDomainResetDate = Date.now();
            Domains.syncToStorage()
        },

        getLastResetDate: () => lastDomainResetDate,

        syncToStorage: () => {
            const toSync = {};
            toSync[storageName] = domainContainer;
            utils.syncToStorage(toSync);
            utils.syncToStorage({'totalDomains': totalDomains});
            utils.syncToStorage({'totalDomainsWithTrackers': totalDomainsWithTrackers});
            utils.syncToStorage({'trackersPerDomain': Domains.getTrackersPerDomain()});
            utils.syncToStorage({'lastDomainResetDate': lastDomainResetDate})
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
                storageData = Domains.sanitizeData(storageData);
                for (domain in storageData) {
                    let newDomain = Domains.add(domain);
                    newDomain.set('count', storageData[domain].count || 0);
                    newDomain.set('pagesSeenOn', storageData[domain].pagesSeenOn || 0)
                }
            });

            utils.getFromStorage('totalDomains', (n) => {
                if (n) totalDomains = n
            });
            utils.getFromStorage('totalDomainsWithTrackers', (n) => {
                if (n) totalDomainsWithTrackers = n
            });
            utils.getFromStorage('lastDomainResetDate', (d) => {
                if (d) {
                    lastDomainResetDate = d
                } else {
                    // if 'lastDomainResetDate' not found, reset all data
                    // https://app.asana.com/0/0/460622849089890/f
                    Domains.resetData()
                }
            })
        }
    }
})();

Domains.buildFromStorage();

// sync data to storage when a tab finishes loading
chrome.tabs.onUpdated.addListener((id, info) => {
    if (info.status === "complete") {
        Domains.syncToStorage()
    }
});

// TODO. Rewire for domains
// chrome.runtime.onMessage.addListener((req, sender, res) => {
//     if (req.getTopBlocked) {
//         res(Domains.getTopBlocked(req.getTopBlocked))
//     } else if (req.getTopBlockedByPages) {
//         res(Domains.getTopBlockedByPages(req.getTopBlockedByPages))
//     } else if (req.resetTrackersData) {
//         Domains.resetData();
//         chrome.runtime.sendMessage({'didResetTrackersData': Domains.getLastResetDate()});
//         res()
//     }
//     return true
// });
