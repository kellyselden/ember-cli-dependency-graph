define('ghost-admin/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive', 'ghost-admin/utils/ghost-paths'], function (exports, _adaptive, _ghostPaths) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    var paths = (0, _ghostPaths.default)();
    var keyName = 'ghost' + (paths.subdir.indexOf('/') === 0 ? '-' + paths.subdir.substr(1) : '') + ':session';

    exports.default = _adaptive.default.extend({
        localStorageKey: keyName,
        cookieName: keyName
    });
});