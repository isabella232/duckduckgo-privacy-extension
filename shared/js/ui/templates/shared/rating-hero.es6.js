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
