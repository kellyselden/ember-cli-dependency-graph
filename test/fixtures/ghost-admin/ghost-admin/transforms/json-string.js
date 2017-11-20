define('ghost-admin/transforms/json-string', ['exports', 'ember-data/transform'], function (exports, _transform) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            var _serialized = serialized === '' ? null : serialized;
            return JSON.parse(_serialized);
        },
        serialize: function serialize(deserialized) {
            return deserialized ? JSON.stringify(deserialized) : null;
        }
    });
});