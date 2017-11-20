define('ghost-admin/serializers/user', ['exports', 'ghost-admin/serializers/application', 'ember-data/serializers/embedded-records-mixin', 'ember-inflector'], function (exports, _application, _embeddedRecordsMixin, _emberInflector) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend(_embeddedRecordsMixin.default, {
        attrs: {
            roles: { embedded: 'always' },
            lastLoginUTC: { key: 'last_seen' },
            createdAtUTC: { key: 'created_at' },
            updatedAtUTC: { key: 'updated_at' }
        },

        extractSingle: function extractSingle(store, primaryType, payload) {
            var root = this.keyForAttribute(primaryType.modelName);
            var pluralizedRoot = (0, _emberInflector.pluralize)(primaryType.modelName);

            payload[root] = payload[pluralizedRoot][0];
            delete payload[pluralizedRoot];

            return this._super.apply(this, arguments);
        },
        normalizeSingleResponse: function normalizeSingleResponse(store, primaryModelClass, payload) {
            var root = this.keyForAttribute(primaryModelClass.modelName);
            var pluralizedRoot = (0, _emberInflector.pluralize)(primaryModelClass.modelName);

            if (payload[pluralizedRoot]) {
                payload[root] = payload[pluralizedRoot][0];
                delete payload[pluralizedRoot];
            }

            return this._super.apply(this, arguments);
        }
    });
});