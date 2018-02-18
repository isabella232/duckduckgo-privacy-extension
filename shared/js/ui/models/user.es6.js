const Parent = window.DDG.base.Model

function UserModel (attrs) {
    attrs = attrs || {}
  Parent.call(this, attrs)
}

UserModel.prototype = window.$.extend({},
  Parent.prototype,
  {
    modelName: 'user',

      getEmail: function () {
          return new Promise((resolve, reject) => {
              this.settings.ready().then(() => {
                  this.email = "allllllright"
                  resolve()
              })
          })
      }
  }
)

module.exports = UserModel
