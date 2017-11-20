define('ghost-admin/serializers/post', ['exports', 'ghost-admin/serializers/application', 'ember-data/serializers/embedded-records-mixin', 'ember-inflector'], function (exports, _application, _embeddedRecordsMixin, _emberInflector) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend(_embeddedRecordsMixin.default, {
        // settings for the EmbeddedRecordsMixin.
        attrs: {
            tags: { embedded: 'always' },
            publishedAtUTC: { key: 'published_at' },
            createdAtUTC: { key: 'created_at' },
            updatedAtUTC: { key: 'updated_at' }
        },

        normalize: function normalize(model, hash, prop) {
            // this is to enable us to still access the raw authorId
            // without requiring an extra get request (since it is an
            // async relationship).
            if ((prop === 'post' || prop === 'posts') && hash.author !== undefined) {
                hash.author_id = hash.author;
            }

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
        },
        normalizeArrayResponse: function normalizeArrayResponse() {
            return this._super.apply(this, arguments);
        },
        serializeIntoHash: function serializeIntoHash(hash, type, record, options) {
            options = options || {};
            options.includeId = true;

            // We have a plural root in the API
            var root = (0, _emberInflector.pluralize)(type.modelName);

            // TODO: this is throwing a warning when saving a new post:
            // The embedded relationship 'tags' is undefined for 'post' with id 'null'.
            // Please include it in your original payload.
            //
            // This appears to be an issue in Ember Data - needs further investigation
            // and possibly an issue raised
            var data = this.serialize(record, options);

            // Properties that exist on the model but we don't want sent in the payload

            delete data.uuid;
            delete data.html;
            // Inserted locally as a convenience.
            delete data.author_id;
            // Read-only virtual property.
            delete data.url;

            hash[root] = [data];
        }
    });
});