define('ghost-admin/services/ghost-paths', ['exports', 'ghost-admin/utils/ghost-paths'], function (exports, _ghostPaths) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Service = Ember.Service;
    var _ProxyMixin = Ember._ProxyMixin;
    exports.default = Service.extend(_ProxyMixin, {
        content: (0, _ghostPaths.default)()
    });
});