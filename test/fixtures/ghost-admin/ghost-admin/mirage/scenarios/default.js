define('ghost-admin/mirage/scenarios/default', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    exports.default = function (server) {
        // Seed your development database using your factories. This
        // data will not be loaded in your tests.

        // server.createList('contact', 10);

        server.createList('subscriber', 125);
        server.createList('tag', 100);
    };
});