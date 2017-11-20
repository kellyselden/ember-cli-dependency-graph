define('ghost-admin/services/media-queries', ['exports'], function (exports) {
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

    var Evented = Ember.Evented;
    var Service = Ember.Service;
    var run = Ember.run;


    var MEDIA_QUERIES = {
        maxWidth600: '(max-width: 600px)',
        isMobile: '(max-width: 800px)',
        maxWidth900: '(max-width: 900px)',
        maxWidth1000: '(max-width: 1000px)'
    };

    exports.default = Service.extend(Evented, {
        init: function init() {
            this._super.apply(this, arguments);
            this._handlers = [];
            this.loadQueries(MEDIA_QUERIES);
        },
        loadQueries: function loadQueries(queries) {
            var _this = this;

            Object.keys(queries).forEach(function (key) {
                _this.loadQuery(key, queries[key]);
            });
        },
        loadQuery: function loadQuery(key, queryString) {
            var _this2 = this;

            var query = window.matchMedia(queryString);

            this.set(key, query.matches);

            var handler = run.bind(this, function () {
                var lastValue = _this2.get(key);
                var newValue = query.matches;
                if (lastValue !== newValue) {
                    _this2.set(key, newValue);
                    _this2.trigger('change', key, newValue);
                }
            });
            query.addListener(handler);
            this._handlers.push([query, handler]);
        },
        willDestroy: function willDestroy() {
            this._handlers.forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    query = _ref2[0],
                    handler = _ref2[1];

                query.removeListener(handler);
            });
            this._super.apply(this, arguments);
        }
    });
});