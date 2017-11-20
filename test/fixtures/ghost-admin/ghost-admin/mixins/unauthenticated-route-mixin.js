define('ghost-admin/mixins/unauthenticated-route-mixin', ['exports'], function (exports) {
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

    var Mixin = Ember.Mixin;
    var service = Ember.inject.service;
    exports.default = Mixin.create({

        ajax: service(),
        ghostPaths: service(),
        session: service(),

        routeIfAlreadyAuthenticated: 'posts',

        beforeModel: function beforeModel() {
            var _this = this,
                _arguments = arguments;

            var authUrl = this.get('ghostPaths.url').api('authentication', 'setup');

            // check the state of the setup process via the API
            return this.get('ajax').request(authUrl).then(function (result) {
                var _result$setup = _slicedToArray(result.setup, 1),
                    setup = _result$setup[0];

                if (setup.status !== true) {
                    _this.transitionTo('setup');
                } else {
                    // NOTE: this is the same as ESA's UnauthenticatedRouteMixin,
                    // adding that mixin to this and calling _super wasn't calling
                    // the ESA mixin's beforeModel method
                    if (_this.get('session').get('isAuthenticated')) {
                        var routeIfAlreadyAuthenticated = _this.get('routeIfAlreadyAuthenticated');

                        return _this.transitionTo(routeIfAlreadyAuthenticated);
                    } else {
                        return _this._super.apply(_this, _arguments);
                    }
                }
            });
        }
    });
});