define('ghost-admin/components/gh-progress-bar', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var htmlSafe = Ember.String.htmlSafe;
    exports.default = Component.extend({
        tagName: '',

        // Public attributes
        percentage: 0,
        isError: false,

        // Internal attributes
        progressStyle: '',

        didReceiveAttrs: function didReceiveAttrs() {
            this._super.apply(this, arguments);

            var percentage = this.get('percentage');
            var width = percentage > 0 ? percentage + '%' : '0';

            this.set('progressStyle', htmlSafe('width: ' + width));
        }
    });
});