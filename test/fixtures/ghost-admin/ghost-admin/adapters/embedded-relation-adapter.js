define('ghost-admin/adapters/embedded-relation-adapter', ['exports', 'ghost-admin/adapters/base'], function (exports, _base) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var get = Ember.get;
    var isNone = Ember.isNone;
    exports.default = _base.default.extend({
        find: function find(store, type, id, snapshot) {
            return this.ajax(this.buildIncludeURL(store, type.modelName, id, snapshot, 'find'), 'GET');
        },
        findRecord: function findRecord(store, type, id, snapshot) {
            return this.ajax(this.buildIncludeURL(store, type.modelName, id, snapshot, 'findRecord'), 'GET');
        },
        findAll: function findAll(store, type, sinceToken) {
            var query = void 0,
                url = void 0;

            if (sinceToken) {
                query = { since: sinceToken };
            }

            url = this.buildIncludeURL(store, type.modelName, null, null, 'findAll');

            return this.ajax(url, 'GET', { data: query });
        },
        query: function query(store, type, _query) {
            return this._super(store, type, this.buildQuery(store, type.modelName, _query));
        },
        queryRecord: function queryRecord(store, type, query) {
            return this._super(store, type, this.buildQuery(store, type.modelName, query));
        },
        createRecord: function createRecord(store, type, snapshot) {
            return this.saveRecord(store, type, snapshot, { method: 'POST' }, 'createRecord');
        },
        updateRecord: function updateRecord(store, type, snapshot) {
            var options = {
                method: 'PUT',
                id: get(snapshot, 'id')
            };

            return this.saveRecord(store, type, snapshot, options, 'updateRecord');
        },
        saveRecord: function saveRecord(store, type, snapshot, options, requestType) {
            var _options = options || {};
            var url = this.buildIncludeURL(store, type.modelName, _options.id, snapshot, requestType);
            var payload = this.preparePayload(store, type, snapshot);

            return this.ajax(url, _options.method, payload);
        },
        preparePayload: function preparePayload(store, type, snapshot) {
            var serializer = store.serializerFor(type.modelName);
            var payload = {};

            serializer.serializeIntoHash(payload, type, snapshot);

            return { data: payload };
        },
        buildIncludeURL: function buildIncludeURL(store, modelName, id, snapshot, requestType, query) {
            var includes = this.getEmbeddedRelations(store, modelName);
            var url = this.buildURL(modelName, id, snapshot, requestType, query);

            if (includes.length) {
                url += '?include=' + includes.join(',');
            }

            return url;
        },
        buildQuery: function buildQuery(store, modelName, options) {
            var deDupe = {};
            var toInclude = this.getEmbeddedRelations(store, modelName);
            var query = options || {};

            if (toInclude.length) {
                // If this is a find by id, build a query object and attach the includes
                if (typeof options === 'string' || typeof options === 'number') {
                    query = {};
                    query.id = options;
                    query.include = toInclude.join(',');
                } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' || isNone(options)) {
                    // If this is a find all (no existing query object) build one and attach
                    // the includes.
                    // If this is a find with an existing query object then merge the includes
                    // into the existing object. Existing properties and includes are preserved.
                    query = query || {};
                    toInclude = toInclude.concat(query.include ? query.include.split(',') : []);

                    toInclude.forEach(function (include) {
                        deDupe[include] = true;
                    });

                    query.include = Object.keys(deDupe).join(',');
                }
            }

            return query;
        },
        getEmbeddedRelations: function getEmbeddedRelations(store, modelName) {
            var model = store.modelFor(modelName);
            var ret = [];

            // Iterate through the model's relationships and build a list
            // of those that need to be pulled in via "include" from the API
            model.eachRelationship(function (name, meta) {
                if (meta.kind === 'hasMany' && Object.prototype.hasOwnProperty.call(meta.options, 'embedded') && meta.options.embedded === 'always') {
                    ret.push(name);
                }
            });

            return ret;
        }
    });
});