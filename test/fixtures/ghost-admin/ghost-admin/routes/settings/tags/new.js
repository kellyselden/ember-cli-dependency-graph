define('ghost-admin/routes/settings/tags/new', ['exports', 'ghost-admin/routes/authenticated'], function (exports, _authenticated) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _authenticated.default.extend({

        controllerName: 'settings.tags.tag',

        model: function model() {
            return this.store.createRecord('tag');
        },
        renderTemplate: function renderTemplate() {
            this.render('settings.tags.tag');
        },


        // reset the model so that mobile screens react to an empty selectedTag
        deactivate: function deactivate() {
            this._super.apply(this, arguments);
            this.set('controller.model', null);
        }
    });
});