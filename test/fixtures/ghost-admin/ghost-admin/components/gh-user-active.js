define('ghost-admin/components/gh-user-active', ['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var computed = Ember.computed;
    var htmlSafe = Ember.String.htmlSafe;
    var service = Ember.inject.service;
    var Handlebars = Ember.Handlebars;
    exports.default = Component.extend({
        tagName: '',

        user: null,

        ghostPaths: service(),

        userDefault: computed('ghostPaths', function () {
            return this.get('ghostPaths.assetRoot') + '/img/user-image.png';
        }),

        userImageBackground: computed('user.profileImage', 'userDefault', function () {
            var url = this.get('user.profileImage') || this.get('userDefault');
            var safeUrl = Handlebars.Utils.escapeExpression(url);

            return htmlSafe('background-image: url(' + safeUrl + ')');
        }),

        lastLoginUTC: computed('user.lastLoginUTC', function () {
            var lastLoginUTC = this.get('user.lastLoginUTC');

            return lastLoginUTC ? (0, _moment.default)(lastLoginUTC).fromNow() : '(Never)';
        })
    });
});