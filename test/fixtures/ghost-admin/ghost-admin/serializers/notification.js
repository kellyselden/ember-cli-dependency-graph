define('ghost-admin/serializers/notification', ['exports', 'ghost-admin/serializers/application'], function (exports, _application) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _application.default.extend({
        attrs: {
            key: { key: 'location' }
        }
    });
});