define('ghost-admin/controllers/posts-loading', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var controller = Ember.inject.controller;
    var readOnly = Ember.computed.readOnly;
    var service = Ember.inject.service;
    exports.default = Controller.extend({

        postsController: controller('posts'),
        session: service(),

        availableTypes: readOnly('postsController.availableTypes'),
        selectedType: readOnly('postsController.selectedType'),
        availableTags: readOnly('postsController.availableTags'),
        selectedTag: readOnly('postsController.selectedTag'),
        availableAuthors: readOnly('postsController.availableAuthors'),
        selectedAuthor: readOnly('postsController.selectedAuthor'),
        availableOrders: readOnly('postsController.availableOrders'),
        selectedOrder: readOnly('postsController.selectedOrder')

    });
});