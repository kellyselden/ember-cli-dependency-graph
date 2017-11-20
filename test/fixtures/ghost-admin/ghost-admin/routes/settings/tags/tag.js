define('ghost-admin/routes/settings/tags/tag', ['exports', 'ghost-admin/routes/authenticated'], function (exports, _authenticated) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _authenticated.default.extend({
        model: function model(params) {
            return this.store.queryRecord('tag', { slug: params.tag_slug });
        },
        serialize: function serialize(model) {
            return { tag_slug: model.get('slug') };
        },
        setupController: function setupController(controller, model) {
            this._super.apply(this, arguments);
            this.controllerFor('settings.tags').scrollTagIntoView(model);
        },


        // reset the model so that mobile screens react to an empty selectedTag
        deactivate: function deactivate() {
            this._super.apply(this, arguments);
            this.set('controller.model', null);
        }
    });
});