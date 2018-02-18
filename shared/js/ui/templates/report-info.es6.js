const bel = require('bel')

module.exports = function () {
        // TODO. once we have user email storing to model, we should switch this to instructions on reinstalling or setting up your email.
        //if (this.model.user && this.model.user.email) {
    return bel`<section class="top-blocked top-blocked--truncated silver-bg">
      <h3 class="padded uppercase text--center">
        Important
      </h3>
      <p class="padded text--center">
        Your report will be sent in XXX hours to
      </p>
      <h1 class="hero__title">
          username@email.com
      </h1>
      <p class="padded text--center">
        If you no longer want this report sent, uninstall this extension immediately.
      </p>
      <p class="padded text--center">
        To do so, right-click the extension icon and click, "Remove from Chrome...".
      </p>
    </section>`
}
