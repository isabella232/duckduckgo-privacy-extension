const bel = require('bel')
const ratingHero = require('./shared/rating-hero.es6.js')
const trackerNetworksIcon = require('./shared/tracker-network-icon.es6.js')
const trackerNetworksText = require('./shared/tracker-networks-text.es6.js')

module.exports = function () {
  const tosdrMsg = (this.model.tosdr && this.model.tosdr.message) ||
     window.constants.tosdrMessages.unknown

  return bel`<section class="site-info site-info--main">
    <ul class="default-list">
    <li class="site-info__rating-li js-hero-open">
      ${ratingHero(this.model, {
        showOpen: !this.model.disabled
      })}
    </li>

    <li class="js-site-tracker-networks js-site-show-page-trackers site-info__li--trackers padded border--bottom text--center">
        ${renderTrackerNetworks(this.model)}
    </li>
  </ul>
  </section>`

  function renderTrackerNetworks (model) {
    const isActive = !model.isWhitelisted ? 'is-active' : ''

    return bel`
      <span class="text-line-after-icon"> ${trackerNetworksText(model)} </span>
    `
  }
}
