const bel = require('bel')
const hero = require('./hero.es6.js')

module.exports = function (site, ops) {
  const status = 'calculating--active'
  const subtitle = siteSubtitle(site.isCalculatingSiteRating, site.siteRating);
  return bel`<div class="rating-hero-container js-rating-hero">
     ${hero({
       // status: status,
       title: site.domain,
       subtitle: subtitle,
       showClose: ops.showClose,
       showOpen: ops.showOpen
     })}
  </div>`
}

// function siteRatingStatus (isCalculating, rating, isWhitelisted) {
//   let status
//   let isActive = ''
//
//   if (isCalculating) {
//     status = 'calculating'
//   } else if (rating && rating.before) {
//     isActive = isWhitelisted ? '' : '--active'
//
//     // if (isActive && rating.after) {
//     //   status = rating.after.toLowerCase()
//     // } else {
//     status = rating.before.toLowerCase()
//     // }
//   } else {
//     status = 'null'
//   }
//
//   return status + isActive
// }

function siteSubtitle (isCalculating, rating) {
  // deal with other states
  let msg = `Domain added to your report`
  if (!isCalculating && !rating.before && !rating.after) {
      msg = `Waiting for data`
      // rating is still calculating
  } else if (isCalculating) {
      msg = `Adding Domain...`
  }
  return bel`${msg}`
}
