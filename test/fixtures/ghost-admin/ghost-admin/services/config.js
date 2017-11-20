define('ghost-admin/services/config', ['exports'], function (exports) {
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

    var Service = Ember.Service;
    var service = Ember.inject.service;
    var assign = Ember.assign;
    var computed = Ember.computed;
    var _ProxyMixin = Ember._ProxyMixin;
    exports.default = Service.extend(_ProxyMixin, {
        ajax: service(),
        ghostPaths: service(),

        content: {},

        fetch: function fetch() {
            var _this = this;

            var configUrl = this.get('ghostPaths.url').api('configuration');

            return this.get('ajax').request(configUrl).then(function (publicConfig) {
                // normalize blogUrl to non-trailing-slash
                var _publicConfig$configu = _slicedToArray(publicConfig.configuration, 1),
                    blogUrl = _publicConfig$configu[0].blogUrl;

                publicConfig.configuration[0].blogUrl = blogUrl.replace(/\/$/, '');

                _this.set('content', publicConfig.configuration[0]);
            });
        },
        fetchPrivate: function fetchPrivate() {
            var _this2 = this;

            var privateConfigUrl = this.get('ghostPaths.url').api('configuration', 'private');

            return this.get('ajax').request(privateConfigUrl).then(function (privateConfig) {
                assign(_this2.get('content'), privateConfig.configuration[0]);
            });
        },


        availableTimezones: computed(function () {
            var timezonesUrl = this.get('ghostPaths.url').api('configuration', 'timezones');

            return this.get('ajax').request(timezonesUrl).then(function (configTimezones) {
                var _configTimezones$conf = _slicedToArray(configTimezones.configuration, 1),
                    timezonesObj = _configTimezones$conf[0];

                timezonesObj = timezonesObj.timezones;

                return timezonesObj;
            });
        }),

        blogDomain: computed('blogUrl', function () {
            var blogUrl = this.get('blogUrl');
            var blogDomain = blogUrl.replace(/^https?:\/\//, '').replace(/\/?$/, '');

            return blogDomain;
        })
    });
});