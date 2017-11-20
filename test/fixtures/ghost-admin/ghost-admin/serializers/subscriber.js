define('ghost-admin/serializers/subscriber', ['exports', 'ghost-admin/serializers/application'], function (exports, _application) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend({
        attrs: {
            unsubscribedAtUTC: { key: 'unsubscribed_at' },
            createdAtUTC: { key: 'created_at' },
            updatedAtUTC: { key: 'updated_at' }
        }
    });
});