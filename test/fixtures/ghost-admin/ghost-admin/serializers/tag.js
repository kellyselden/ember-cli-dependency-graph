define('ghost-admin/serializers/tag', ['exports', 'ghost-admin/serializers/application', 'ember-inflector'], function (exports, _application, _emberInflector) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend({
        attrs: {
            createdAtUTC: { key: 'created_at' },
            updatedAtUTC: { key: 'updated_at' }
        },

        serializeIntoHash: function serializeIntoHash(hash, type, record, options) {
            options = options || {};
            options.includeId = true;

            var root = (0, _emberInflector.pluralize)(type.modelName);
            var data = this.serialize(record, options);

            // Properties that exist on the model but we don't want sent in the payload

            delete data.count;

            hash[root] = [data];
        },


        // if we use `queryRecord` ensure we grab the first record to avoid
        // DS.SERIALIZER.REST.QUERYRECORD-ARRAY-RESPONSE deprecations
        normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
            if (requestType === 'queryRecord') {
                var singular = primaryModelClass.modelName;
                var plural = (0, _emberInflector.pluralize)(singular);

                if (payload[plural]) {
                    payload[singular] = payload[plural][0];
                    delete payload[plural];
                }
            }
            return this._super.apply(this, arguments);
        }
    });
});