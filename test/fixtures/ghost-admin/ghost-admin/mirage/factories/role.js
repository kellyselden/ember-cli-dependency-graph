define('ghost-admin/mirage/factories/role', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Factory.extend({
        createdAt: '2013-11-25T14:48:11.000Z',
        createdBy: 1,
        description: function description(i) {
            return 'Role ' + i;
        },

        name: '',
        updatedAt: '2013-11-25T14:48:11.000Z',
        updatedBy: 1
    });
});