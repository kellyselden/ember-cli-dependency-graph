define('ghost-admin/components/gh-blog-url', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Component = Ember.Component;
    var service = Ember.inject.service;
    exports.default = Component.extend({
        tagName: '',

        config: service()
    });
});