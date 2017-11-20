define('ghost-admin/routes/about', ['exports', 'ghost-admin/routes/authenticated', 'ghost-admin/mixins/style-body'], function (exports, _authenticated, _styleBody) {
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

    var service = Ember.inject.service;
    exports.default = _authenticated.default.extend(_styleBody.default, {
        titleToken: 'About',

        classNames: ['view-about'],

        ghostPaths: service(),
        ajax: service(),

        cachedConfig: false,

        model: function model() {
            var _this = this;

            var cachedConfig = this.get('cachedConfig');
            var configUrl = this.get('ghostPaths.url').api('configuration', 'about');

            if (cachedConfig) {
                return cachedConfig;
            }

            return this.get('ajax').request(configUrl).then(function (configurationResponse) {
                var _configurationRespons = _slicedToArray(configurationResponse.configuration, 1),
                    cachedConfig = _configurationRespons[0];

                _this.set('cachedConfig', cachedConfig);

                return cachedConfig;
            });
        }
    });
});