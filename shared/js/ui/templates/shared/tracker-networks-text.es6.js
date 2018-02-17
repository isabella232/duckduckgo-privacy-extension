const bel = require('bel')

module.exports = function (site, isMajorNetworksCount, includeUniqueTrackersCount) {
  const trackerNetworksCount = isMajorNetworksCount ? site.majorTrackerNetworksCount : site.totalTrackerNetworksCount

  let trackersText = isMajorNetworksCount ? ' Major Tracker' : ' Tracker'
  trackersText += (trackerNetworksCount === 1) ? ' Network ' : ' Networks '
  let finalText = trackerNetworksCount + trackersText + 'Found'

  if (includeUniqueTrackersCount && trackerNetworksCount > 0) {
    const uniqueTrackersText = site.trackersCount === 1 ? ' Unique Tracker In ' : ' Unique Trackers In '
    finalText = site.trackersCount + uniqueTrackersText + finalText
    return bel`${finalText}`
  }
  return bel`${finalText}`
}

