define('ghost-admin/controllers/subscribers', ['exports', 'ghost-admin/mixins/pagination', 'ember-light-table', 'ghost-admin/utils/ghost-paths'], function (exports, _pagination, _emberLightTable, _ghostPaths) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Controller = Ember.Controller;
    var assign = Ember.assign;
    var computed = Ember.computed;
    var service = Ember.inject.service;
    exports.default = Controller.extend(_pagination.default, {

        queryParams: ['order', 'direction'],
        order: 'created_at',
        direction: 'desc',

        paginationModel: 'subscriber',

        total: 0,
        table: null,
        subscriberToDelete: null,

        session: service(),

        // paginationSettings is replaced by the pagination mixin so we need a
        // getter/setter CP here so that we don't lose the dynamic order param
        paginationSettings: computed('order', 'direction', {
            get: function get() {
                var order = this.get('order');
                var direction = this.get('direction');

                var currentSettings = this._paginationSettings || {
                    limit: 30
                };

                return assign({}, currentSettings, {
                    order: order + ' ' + direction
                });
            },
            set: function set(key, value) {
                this._paginationSettings = value;
                return value;
            }
        }),

        columns: computed('order', 'direction', function () {
            var order = this.get('order');
            var direction = this.get('direction');

            return [{
                label: 'Email Address',
                valuePath: 'email',
                sorted: order === 'email',
                ascending: direction === 'asc',
                classNames: ['gh-subscribers-table-email-cell'],
                cellClassNames: ['gh-subscribers-table-email-cell']
            }, {
                label: 'Subscription Date',
                valuePath: 'createdAtUTC',
                format: function format(value) {
                    return value.format('MMMM DD, YYYY');
                },

                sorted: order === 'created_at',
                ascending: direction === 'asc',
                classNames: ['gh-subscribers-table-date-cell'],
                cellClassNames: ['gh-subscribers-table-date-cell']
            }, {
                label: 'Status',
                valuePath: 'status',
                sorted: order === 'status',
                ascending: direction === 'asc',
                classNames: ['gh-subscribers-table-status-cell'],
                cellClassNames: ['gh-subscribers-table-status-cell']
            }, {
                label: '',
                sortable: false,
                cellComponent: 'gh-subscribers-table-delete-cell',
                align: 'right',
                classNames: ['gh-subscribers-table-delete-cell'],
                cellClassNames: ['gh-subscribers-table-delete-cell']
            }];
        }),

        initializeTable: function initializeTable() {
            this.set('table', new _emberLightTable.default(this.get('columns'), this.get('subscribers')));
        },


        // capture the total from the server any time we fetch a new page
        didReceivePaginationMeta: function didReceivePaginationMeta(meta) {
            if (meta && meta.pagination) {
                this.set('total', meta.pagination.total);
            }
        },


        actions: {
            loadFirstPage: function loadFirstPage() {
                var table = this.get('table');

                return this._super.apply(this, arguments).then(function (results) {
                    table.addRows(results);
                    return results;
                });
            },
            loadNextPage: function loadNextPage() {
                var table = this.get('table');

                return this._super.apply(this, arguments).then(function (results) {
                    table.addRows(results);
                    return results;
                });
            },
            sortByColumn: function sortByColumn(column) {
                var table = this.get('table');

                if (column.sorted) {
                    this.setProperties({
                        order: column.get('valuePath').trim().replace(/UTC$/, '').underscore(),
                        direction: column.ascending ? 'asc' : 'desc'
                    });
                    table.setRows([]);
                    this.send('loadFirstPage');
                }
            },
            addSubscriber: function addSubscriber(subscriber) {
                this.get('table').insertRowAt(0, subscriber);
                this.incrementProperty('total');
            },
            deleteSubscriber: function deleteSubscriber(subscriber) {
                this.set('subscriberToDelete', subscriber);
            },
            confirmDeleteSubscriber: function confirmDeleteSubscriber() {
                var _this = this;

                var subscriber = this.get('subscriberToDelete');

                return subscriber.destroyRecord().then(function () {
                    _this.set('subscriberToDelete', null);
                    _this.get('table').removeRow(subscriber);
                    _this.decrementProperty('total');
                });
            },
            cancelDeleteSubscriber: function cancelDeleteSubscriber() {
                this.set('subscriberToDelete', null);
            },
            reset: function reset() {
                this.get('table').setRows([]);
                this.send('loadFirstPage');
            },
            exportData: function exportData() {
                var exportUrl = (0, _ghostPaths.default)().url.api('subscribers/csv');
                var accessToken = this.get('session.data.authenticated.access_token');
                var downloadURL = exportUrl + '?access_token=' + accessToken;
                var iframe = $('#iframeDownload');

                if (iframe.length === 0) {
                    iframe = $('<iframe>', { id: 'iframeDownload' }).hide().appendTo('body');
                }

                iframe.attr('src', downloadURL);
            }
        }
    });
});