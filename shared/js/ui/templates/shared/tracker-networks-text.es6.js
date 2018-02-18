const bel = require('bel')

module.exports = function (site, isMajorNetworksCount, includeUniqueTrackersCount) {
  const trackerNetworksCount = isMajorNetworksCount ? site.majorTrackerNetworksCount : site.totalTrackerNetworksCount
  const trackersHeader = 'This page shared your data with';
  let trackersCount = site.trackersCount;
    trackersCount += (trackerNetworksCount === 1) ? ' external tracker' : ' external trackers'
  return bel`<p class="text--center">
    ${trackersHeader}
    <h4> 
      ${trackersCount}
    </h4>
   </p>`
}

