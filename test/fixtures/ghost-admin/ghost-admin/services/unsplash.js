define('ghost-admin/services/unsplash', ['exports', 'fetch', 'ember-concurrency'], function (exports, _fetch, _emberConcurrency) {
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

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var Service = Ember.Service;
    var service = Ember.inject.service;
    var isEmpty = Ember.isEmpty;
    var or = Ember.computed.or;
    var reject = Ember.RSVP.reject;
    var resolve = Ember.RSVP.resolve;


    var API_URL = 'https://api.unsplash.com';
    var API_VERSION = 'v1';
    var DEBOUNCE_MS = 600;

    exports.default = Service.extend({
        config: service(),
        settings: service(),

        columnCount: 3,
        columns: null,
        error: '',
        photos: null,
        searchTerm: '',

        _columnHeights: null,
        _pagination: null,

        applicationId: '8672af113b0a8573edae3aa3713886265d9bb741d707f6c01a486cde8c278980',
        isLoading: or('_search.isRunning', '_loadingTasks.isRunning'),

        init: function init() {
            this._super.apply(this, arguments);
            this._reset();
        },
        loadNew: function loadNew() {
            this._reset();
            return this.get('_loadNew').perform();
        },
        loadNextPage: function loadNextPage() {
            // protect against scroll trigger firing when the photos are reset
            if (this.get('_search.isRunning')) {
                return;
            }

            if (isEmpty(this.get('photos'))) {
                return this.get('_loadNew').perform();
            }

            if (this._pagination.next) {
                return this.get('_loadNextPage').perform();
            }

            // TODO: return error?
            return reject();
        },
        retryLastRequest: function retryLastRequest() {
            return this.get('_retryLastRequest').perform();
        },
        changeColumnCount: function changeColumnCount(newColumnCount) {
            if (newColumnCount !== this.get('columnCount')) {
                this.set('columnCount', newColumnCount);
                this._resetColumns();
            }
        },


        actions: {
            updateSearch: function updateSearch(term) {
                if (term === this.get('searchTerm')) {
                    return;
                }

                this.set('searchTerm', term);
                this._reset();

                if (term) {
                    return this.get('_search').perform(term);
                } else {
                    return this.get('_loadNew').perform();
                }
            }
        },

        _loadingTasks: (0, _emberConcurrency.taskGroup)().drop(),

        _loadNew: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var url;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            url = API_URL + '/photos?per_page=30';
                            _context.next = 3;
                            return this._makeRequest(url);

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })).group('_loadingTasks'),

        _loadNextPage: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._makeRequest(this._pagination.next);

                        case 2:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })).group('_loadingTasks'),

        _retryLastRequest: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return this._makeRequest(this._lastRequestUrl);

                        case 2:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })).group('_loadingTasks'),

        _search: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(term) {
            var url;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return (0, _emberConcurrency.timeout)(DEBOUNCE_MS);

                        case 2:
                            url = API_URL + '/search/photos?query=' + term + '&per_page=30';
                            _context4.next = 5;
                            return this._makeRequest(url);

                        case 5:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        })).restartable(),

        _addPhotosFromResponse: function _addPhotosFromResponse(response) {
            var _this = this;

            var photos = response.results || response;

            photos.forEach(function (photo) {
                return _this._addPhoto(photo);
            });
        },
        _addPhoto: function _addPhoto(photo) {
            // pre-calculate ratio for later use
            photo.ratio = photo.height / photo.width;

            // add to general photo list
            this.get('photos').pushObject(photo);

            // add to least populated column
            this._addPhotoToColumns(photo);
        },
        _addPhotoToColumns: function _addPhotoToColumns(photo) {
            var min = Math.min.apply(Math, _toConsumableArray(this._columnHeights));
            var columnIndex = this._columnHeights.indexOf(min);

            // use a fixed width when calculating height to compensate for different
            // overall image sizes
            this._columnHeights[columnIndex] += 300 * photo.ratio;
            this.get('columns')[columnIndex].pushObject(photo);
        },
        _reset: function _reset() {
            this.set('photos', []);
            this._pagination = {};
            this._resetColumns();
        },
        _resetColumns: function _resetColumns() {
            var _this2 = this;

            var columns = [];
            var columnHeights = [];

            // pre-fill column arrays based on columnCount
            for (var i = 0; i < this.get('columnCount'); i++) {
                columns[i] = [];
                columnHeights[i] = 0;
            }

            this.set('columns', columns);
            this._columnHeights = columnHeights;

            if (!isEmpty(this.get('photos'))) {
                this.get('photos').forEach(function (photo) {
                    _this2._addPhotoToColumns(photo);
                });
            }
        },
        _makeRequest: function _makeRequest(url) {
            var _this3 = this;

            var headers = {};

            // clear any previous error
            this.set('error', '');

            // store the url so it can be retried if needed
            this._lastRequestUrl = url;

            headers.Authorization = 'Client-ID ' + this.get('applicationId');
            headers['Accept-Version'] = API_VERSION;
            headers['App-Pragma'] = 'no-cache';
            headers['X-Unsplash-Cache'] = true;

            return (0, _fetch.default)(url, { headers: headers }).then(function (response) {
                return _this3._checkStatus(response);
            }).then(function (response) {
                return _this3._extractPagination(response);
            }).then(function (response) {
                return response.json();
            }).then(function (response) {
                return _this3._addPhotosFromResponse(response);
            }).catch(function () {
                // if the error text isn't already set then we've get a connection error from `fetch`
                if (!_this3.get('error')) {
                    _this3.set('error', 'Uh-oh! Trouble reaching the Unsplash API, please check your connection');
                }
            });
        },
        _checkStatus: function _checkStatus(response) {
            var _this4 = this;

            // successful request
            if (response.status >= 200 && response.status < 300) {
                return resolve(response);
            }

            var errorText = '';
            var responseTextPromise = resolve();

            if (response.headers.map['content-type'] === 'application/json') {
                responseTextPromise = response.json().then(function (json) {
                    return json.errors[0];
                });
            } else if (response.headers.map['content-type'] === 'text/xml') {
                responseTextPromise = response.text();
            }

            return responseTextPromise.then(function (responseText) {
                if (response.status === 403 && response.headers.map['x-ratelimit-remaining'] === '0') {
                    // we've hit the ratelimit on the API
                    errorText = 'Unsplash API rate limit reached, please try again later.';
                }

                errorText = errorText || responseText || 'Error ' + response.status + ': Uh-oh! Trouble reaching the Unsplash API';

                // set error text for display in UI
                _this4.set('error', errorText);

                // throw error to prevent further processing
                var error = new Error(errorText);
                error.response = response;
                throw error;
            });
        },
        _extractPagination: function _extractPagination(response) {
            var pagination = {};
            var linkRegex = new RegExp('<(.*)>; rel="(.*)"');
            var link = response.headers.map.link;


            if (link) {
                link.split(',').forEach(function (link) {
                    var _linkRegex$exec = linkRegex.exec(link),
                        _linkRegex$exec2 = _slicedToArray(_linkRegex$exec, 3),
                        url = _linkRegex$exec2[1],
                        rel = _linkRegex$exec2[2];

                    pagination[rel] = url;
                });
            }

            this._pagination = pagination;

            return response;
        }
    });
});