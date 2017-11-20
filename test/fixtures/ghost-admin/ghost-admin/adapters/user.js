define('ghost-admin/adapters/user', ['exports', 'ghost-admin/adapters/application', 'ghost-admin/mixins/slug-url'], function (exports, _application, _slugUrl) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend(_slugUrl.default, {
        find: function find(store, type, id) {
            return this.findQuery(store, type, { id: id, status: 'all' });
        },


        // TODO: This is needed because the API currently expects you to know the
        // status of the record before retrieving by ID. Quick fix is to always
        // include status=all in the query
        findRecord: function findRecord(store, type, id, snapshot) {
            var url = this.buildIncludeURL(store, type.modelName, id, snapshot, 'findRecord');

            url += '&status=all';

            return this.ajax(url, 'GET');
        },
        findAll: function findAll(store, type, id) {
            return this.query(store, type, { id: id, status: 'all' });
        },
        queryRecord: function queryRecord(store, type, query) {
            if (!query || query.id !== 'me') {
                return this._super.apply(this, arguments);
            }

            var url = this.buildURL(type.modelName, 'me', null, 'findRecord');

            return this.ajax(url, 'GET', { data: { include: 'roles' } });
        }
    });
});