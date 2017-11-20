define('ghost-admin/routes/posts', ['exports', 'ghost-admin/routes/authenticated', 'ember-infinity/mixins/route'], function (exports, _authenticated, _route) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var assign = Ember.assign;
    var isBlank = Ember.isBlank;
    exports.default = _authenticated.default.extend(_route.default, {
        titleToken: 'Content',

        perPage: 30,
        perPageParam: 'limit',
        totalPagesParam: 'meta.pagination.pages',

        queryParams: {
            type: {
                refreshModel: true,
                replace: true
            },
            author: {
                refreshModel: true,
                replace: true
            },
            tag: {
                refreshModel: true,
                replace: true
            },
            order: {
                refreshModel: true,
                replace: true
            }
        },

        _type: null,

        model: function model(params) {
            var _this = this;

            return this.get('session.user').then(function (user) {
                var queryParams = _this._typeParams(params.type);
                var filterParams = { tag: params.tag };

                if (params.type === 'featured') {
                    filterParams.featured = true;
                }

                if (user.get('isAuthor')) {
                    // authors can only view their own posts
                    filterParams.author = user.get('slug');
                } else if (params.author) {
                    filterParams.author = params.author;
                }

                var filter = _this._filterString(filterParams);
                if (!isBlank(filter)) {
                    queryParams.filter = filter;
                }

                if (!isBlank(params.order)) {
                    queryParams.order = params.order;
                }

                queryParams.formats = 'mobiledoc,plaintext';

                var perPage = _this.get('perPage');
                var paginationSettings = assign({ perPage: perPage, startingPage: 1 }, queryParams);

                return _this.infinityModel('post', paginationSettings);
            });
        },
        _typeParams: function _typeParams(type) {
            var status = 'all';
            var staticPages = 'all';

            switch (type) {
                case 'draft':
                    status = 'draft';
                    staticPages = false;
                    break;
                case 'published':
                    status = 'published';
                    staticPages = false;
                    break;
                case 'scheduled':
                    status = 'scheduled';
                    staticPages = false;
                    break;
                case 'page':
                    staticPages = true;
                    break;
            }

            return {
                status: status,
                staticPages: staticPages
            };
        },
        _filterString: function _filterString(filter) {
            return Object.keys(filter).map(function (key) {
                var value = filter[key];

                if (!isBlank(value)) {
                    return key + ':' + filter[key];
                }
            }).compact().join('+');
        },


        // trigger a background load of all tags and authors for use in the filter dropdowns
        setupController: function setupController(controller) {
            var _this2 = this;

            this._super.apply(this, arguments);

            if (!controller._hasLoadedTags) {
                this.get('store').query('tag', { limit: 'all' }).then(function () {
                    controller._hasLoadedTags = true;
                });
            }

            this.get('session.user').then(function (user) {
                if (!user.get('isAuthor') && !controller._hasLoadedAuthors) {
                    _this2.get('store').query('user', { limit: 'all' }).then(function () {
                        controller._hasLoadedAuthors = true;
                    });
                }
            });
        },


        actions: {
            willTransition: function willTransition() {
                if (this.get('controller')) {
                    this.resetController();
                }
            },
            queryParamsDidChange: function queryParamsDidChange() {
                // scroll back to the top
                $('.content-list').scrollTop(0);

                this._super.apply(this, arguments);
            }
        }
    });
});