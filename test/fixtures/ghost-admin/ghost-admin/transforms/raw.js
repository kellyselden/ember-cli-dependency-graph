define('ghost-admin/transforms/raw', ['exports', 'ember-data/transform'], function (exports, _transform) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            return serialized;
        },
        serialize: function serialize(deserialized) {
            return deserialized;
        }
    });
});