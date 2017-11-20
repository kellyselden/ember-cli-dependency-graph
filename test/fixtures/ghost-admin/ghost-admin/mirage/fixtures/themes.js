define('ghost-admin/mirage/fixtures/themes', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = [{
        name: 'casper',
        package: {
            name: 'Blog',
            version: '1.0'
        },
        active: true
    }, {
        name: 'foo',
        package: {
            name: 'Foo',
            version: '0.1'
        }
    }, {
        name: 'bar'
    }];
});