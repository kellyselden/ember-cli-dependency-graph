define('ghost-admin/routes/settings/design/uploadtheme', ['exports', 'ghost-admin/routes/authenticated'], function (exports, _authenticated) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _authenticated.default.extend({
        model: function model() {
            return this.get('store').findAll('theme');
        },


        actions: {
            cancel: function cancel() {
                this.transitionTo('settings.design');
            }
        }
    });
});