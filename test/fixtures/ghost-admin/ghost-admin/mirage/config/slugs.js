define('ghost-admin/mirage/config/slugs', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockSlugs;
    var dasherize = Ember.String.dasherize;
    function mockSlugs(server) {
        server.get('/slugs/post/:slug/', function (schema, request) {
            return {
                slugs: [{ slug: dasherize(decodeURIComponent(request.params.slug)) }]
            };
        });

        server.get('/slugs/user/:slug/', function (schema, request) {
            return {
                slugs: [{ slug: dasherize(decodeURIComponent(request.params.slug)) }]
            };
        });
    }
});