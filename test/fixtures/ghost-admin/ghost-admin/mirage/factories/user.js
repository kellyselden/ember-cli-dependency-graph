define('ghost-admin/mirage/factories/user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Factory.extend({
        accessibility: null,
        bio: null,
        coverImage: null,
        createdAt: '2015-09-02T13:41:50.000Z',
        createdBy: null,
        email: function email(i) {
            return 'user-' + i + '@example.com';
        },

        profileImage: '//www.gravatar.com/avatar/3ae045bc198a157401827c8455cd7c99?s=250&d=mm&r=x',
        lastLogin: '2015-11-02T16:12:05.000Z',
        location: null,
        metaDescription: null,
        metaTitle: null,
        name: function name(i) {
            return 'User ' + i;
        },
        slug: function slug(i) {
            return 'user-' + i;
        },

        status: 'active',
        tour: null,
        updatedAt: '2015-11-02T16:12:05.000Z',
        updatedBy: '2015-09-02T13:41:50.000Z',
        website: 'http://example.com',
        roles: []
    });
});