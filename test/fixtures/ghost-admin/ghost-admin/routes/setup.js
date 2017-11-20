define('ghost-admin/routes/setup', ['exports', 'ghost-admin/mixins/style-body'], function (exports, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var Route = Ember.Route;
    var service = Ember.inject.service;
    exports.default = Route.extend(_styleBody.default, {
        titleToken: 'Setup',

        classNames: ['ghost-setup'],

        ghostPaths: service(),
        session: service(),
        ajax: service(),
        config: service(),

        // use the beforeModel hook to check to see whether or not setup has been
        // previously completed.  If it has, stop the transition into the setup page.
        beforeModel: function beforeModel() {
            var _this = this;

            this._super.apply(this, arguments);

            if (this.get('session.isAuthenticated')) {
                return this.transitionTo('posts');
            }

            var authUrl = this.get('ghostPaths.url').api('authentication', 'setup');

            // check the state of the setup process via the API
            return this.get('ajax').request(authUrl).then(function (result) {
                var _result$setup = _slicedToArray(result.setup, 1),
                    setup = _result$setup[0];

                if (setup.status) {
                    return _this.transitionTo('signin');
                } else {
                    var controller = _this.controllerFor('setup/two');
                    if (setup.title) {
                        controller.set('blogTitle', setup.title.replace(/&apos;/gim, '\''));
                    }

                    if (setup.name) {
                        controller.set('name', setup.name.replace(/&apos;/gim, '\''));
                    }

                    if (setup.email) {
                        controller.set('email', setup.email);
                    }
                }
            });
        },
        deactivate: function deactivate() {
            this._super.apply(this, arguments);
            this.controllerFor('setup/two').set('password', '');
        }
    });
});