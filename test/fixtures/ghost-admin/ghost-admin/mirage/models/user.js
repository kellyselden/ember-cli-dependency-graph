define('ghost-admin/mirage/models/user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Model.extend({
        // used by the serializer to determine whether
        // or not to include the post count
        postCount: false,

        roles: (0, _emberCliMirage.hasMany)(),
        posts: (0, _emberCliMirage.hasMany)('post', { inverse: 'author' })
    });
});