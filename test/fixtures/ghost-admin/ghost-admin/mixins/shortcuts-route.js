define('ghost-admin/mixins/shortcuts-route', ['exports', 'ghost-admin/mixins/shortcuts'], function (exports, _shortcuts) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    exports.default = Mixin.create(_shortcuts.default, {
        activate: function activate() {
            this._super.apply(this, arguments);
            this.registerShortcuts();
        },
        deactivate: function deactivate() {
            this._super.apply(this, arguments);
            this.removeShortcuts();
        }
    });
});