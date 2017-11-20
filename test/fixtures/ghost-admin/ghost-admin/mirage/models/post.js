define('ghost-admin/mirage/models/post', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Model.extend({
        author: (0, _emberCliMirage.belongsTo)('user')
    });
});