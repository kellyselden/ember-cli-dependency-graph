define('ghost-admin/mixins/current-user-settings', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Mixin = Ember.Mixin;
    exports.default = Mixin.create({
        transitionAuthor: function transitionAuthor() {
            var _this = this;

            return function (user) {
                if (user.get('isAuthor')) {
                    return _this.transitionTo('team.user', user);
                }

                return user;
            };
        },
        transitionEditor: function transitionEditor() {
            var _this2 = this;

            return function (user) {
                if (user.get('isEditor')) {
                    return _this2.transitionTo('team');
                }

                return user;
            };
        }
    });
});