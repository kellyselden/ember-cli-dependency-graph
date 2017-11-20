define('ghost-admin/mirage/factories/notification', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Factory.extend({
        dismissible: true,
        message: 'This is an alert',
        status: 'alert',
        type: 'error'
    });
});