define('ghost-admin/mirage/fixtures/configurations', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = [{
        blogTitle: 'Test Blog',
        blogUrl: window.location.origin + '/',
        clientId: 'ghost-admin',
        clientSecret: '1234ClientSecret',
        fileStorage: 'true',
        internalTags: 'false',
        publicAPI: 'false',
        routeKeywords: {
            tag: 'tag',
            author: 'author',
            page: 'page',
            preview: 'p',
            private: 'private'
        },
        useGravatar: 'true'
    }];
});