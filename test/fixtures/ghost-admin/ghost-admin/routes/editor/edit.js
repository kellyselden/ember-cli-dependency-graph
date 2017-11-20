define('ghost-admin/routes/editor/edit', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/editor-base-route'], function (exports, _authenticated, _editorBaseRoute) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _authenticated.default.extend(_editorBaseRoute.default, {
        titleToken: 'Editor',

        beforeModel: function beforeModel(transition) {
            this.set('_transitionedFromNew', transition.data.fromNew);

            this._super.apply(this, arguments);
        },
        model: function model(params) {
            var _this = this;

            /* eslint-disable camelcase */
            var query = {
                id: params.post_id,
                status: 'all',
                staticPages: 'all',
                formats: 'mobiledoc,plaintext'
            };
            /* eslint-enable camelcase */

            return this.store.query('post', query).then(function (records) {
                var post = records.get('firstObject');

                if (post) {
                    return post;
                }

                return _this.replaceWith('posts.index');
            });
        },
        afterModel: function afterModel(post) {
            var _this2 = this;

            this._super.apply(this, arguments);

            return this.get('session.user').then(function (user) {
                if (user.get('isAuthor') && !post.isAuthoredByUser(user)) {
                    return _this2.replaceWith('posts.index');
                }
            });
        },
        setupController: function setupController(controller) {
            this._super.apply(this, arguments);
            controller.set('shouldFocusEditor', this.get('_transitionedFromNew'));
        },


        actions: {
            authorizationFailed: function authorizationFailed() {
                this.get('controller').send('toggleReAuthenticateModal');
            },
            redirectToContentScreen: function redirectToContentScreen() {
                this.transitionTo('posts');
            }
        }
    });
});