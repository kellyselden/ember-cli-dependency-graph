define('ghost-admin/serializers/invite', ['exports', 'ghost-admin/serializers/application'], function (exports, _application) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend({
        attrs: {
            role: { key: 'role_id' },
            createdAtUTC: { key: 'created_at' },
            updatedAtUTC: { key: 'updated_at' }
        }
    });
});