define('ghost-admin/transforms/moment-utc', ['exports', 'ember-data/transform', 'moment'], function (exports, _transform, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            if (serialized) {
                return _moment.default.utc(serialized);
            }
            return serialized;
        },
        serialize: function serialize(deserialized) {
            if (deserialized) {
                try {
                    return deserialized.toJSON();
                } catch (e) {
                    return deserialized;
                }
            }
            return deserialized;
        }
    });
});