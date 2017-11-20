define('ghost-admin/controllers/setup', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var controller = Ember.inject.controller;
    var computed = Ember.computed;
    var match = Ember.computed.match;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        appController: controller('application'),
        ghostPaths: service(),

        showBackLink: match('appController.currentRouteName', /^setup\.(two|three)$/),

        backRoute: computed('appController.currentRouteName', function () {
            var currentRoute = this.get('appController.currentRouteName');

            return currentRoute === 'setup.two' ? 'setup.one' : 'setup.two';
        })
    });
});