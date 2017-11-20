define('ghost-admin/adapters/application', ['exports', 'ghost-admin/adapters/embedded-relation-adapter'], function (exports, _embeddedRelationAdapter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _embeddedRelationAdapter.default.extend({
        shouldBackgroundReloadRecord: function shouldBackgroundReloadRecord() {
            return false;
        }
    });
});