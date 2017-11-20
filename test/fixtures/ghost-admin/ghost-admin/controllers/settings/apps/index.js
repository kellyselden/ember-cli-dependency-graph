define('ghost-admin/controllers/settings/apps/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var service = Ember.inject.service;
    exports.default = Controller.extend({
        settings: service()
    });
});