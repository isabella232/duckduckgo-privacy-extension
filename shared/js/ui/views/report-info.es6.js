const Parent = window.DDG.base.View

function Report (ops) {
    this.model = ops.model
    this.pageView = ops.pageView
    this.template = ops.template

    // TODO, lookup the stored email hereish
    // this.model.getEmail().then(() => {
        Parent.call(this, ops)
        this._setup()
    // })

    this.bindEvents([
        // [this.model.store.subscribe, 'action:backgroundMessage', this.handleBackgroundMsg]
    ])
}

Report.prototype = window.$.extend({},
    Parent.prototype,
    {

        _setup: function () {
            this._cacheElems('.js-report', ['graph-bar-fg', 'pct'])
            this.bindEvents([
            ])
        },

        rerenderList: function () {
            this._rerender()
            this._setup()
        },

        handleBackgroundMsg: function (message) {
            if (!message || !message.action) return

            if (message.action === 'didResetTrackersData') {
                // this.model.reset()
                setTimeout(() => this.rerenderList(), 750)
                this.rerenderList()
            }
        }
    }
)

module.exports = Report
