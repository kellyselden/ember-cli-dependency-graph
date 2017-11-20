define('ghost-admin/transforms/moment-date', ['exports', 'ember-data/transform', 'moment'], function (exports, _transform, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            if (serialized) {
                return (0, _moment.default)(serialized);
            }
            return serialized;
        },
        serialize: function serialize(deserialized) {
            if (deserialized) {
                return (0, _moment.default)(deserialized).toDate();
            }
            return deserialized;
        }
    });
});