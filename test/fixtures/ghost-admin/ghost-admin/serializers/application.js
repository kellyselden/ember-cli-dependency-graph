define('ghost-admin/serializers/application', ['exports', 'ember-data/serializers/rest', 'ember-inflector'], function (exports, _rest, _emberInflector) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var decamelize = Ember.String.decamelize;
    exports.default = _rest.default.extend({
        serializeIntoHash: function serializeIntoHash(hash, type, record, options) {
            // Our API expects an id on the posted object
            options = options || {};
            options.includeId = true;

            // We have a plural root in the API
            var root = (0, _emberInflector.pluralize)(type.modelName);
            var data = this.serialize(record, options);

            hash[root] = [data];
        },
        keyForAttribute: function keyForAttribute(attr) {
            return decamelize(attr);
        }
    });
});