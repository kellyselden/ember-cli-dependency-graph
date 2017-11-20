define('ghost-admin/routes/editor/new', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/editor-base-route'], function (exports, _authenticated, _editorBaseRoute) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _authenticated.default.extend(_editorBaseRoute.default, {
        titleToken: 'Editor',

        model: function model() {
            var _this = this;

            return this.get('session.user').then(function (user) {
                return _this.store.createRecord('post', {
                    author: user
                });
            });
        },
        renderTemplate: function renderTemplate(controller, model) {
            this.render('editor/edit', {
                controller: controller,
                model: model
            });
        },


        actions: {
            willTransition: function willTransition(transition) {
                // decorate the transition object so the editor.edit route
                // knows this was the previous active route
                transition.data.fromNew = true;

                this._super.apply(this, arguments);
            }
        }
    });
});