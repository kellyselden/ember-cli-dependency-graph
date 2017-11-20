define('ghost-admin/routes/settings/tags/index', ['exports', 'ghost-admin/routes/authenticated'], function (exports, _authenticated) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend({
        mediaQueries: service(),

        beforeModel: function beforeModel() {
            var firstTag = this.modelFor('settings.tags').get('firstObject');

            this._super.apply(this, arguments);

            if (firstTag && !this.get('mediaQueries.maxWidth600')) {
                this.transitionTo('settings.tags.tag', firstTag);
            }
        }
    });
});