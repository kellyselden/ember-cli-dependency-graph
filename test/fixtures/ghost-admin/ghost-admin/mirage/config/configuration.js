define('ghost-admin/mirage/config/configuration', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockConfiguration;
    var isEmpty = Ember.isEmpty;
    function mockConfiguration(server) {
        server.get('/configuration/', function (_ref) {
            var db = _ref.db;

            if (isEmpty(db.configurations)) {
                server.loadFixtures('configurations');
            }

            return {
                configuration: [db.configurations.find(1)]
            };
        });

        server.get('/configuration/timezones/', function (_ref2) {
            var db = _ref2.db;

            if (isEmpty(db.timezones)) {
                server.loadFixtures('timezones');
            }

            return {
                configuration: [{
                    timezones: db.timezones
                }]
            };
        });

        server.get('/configuration/private/', function (_ref3) {
            var db = _ref3.db;

            if (isEmpty(db.private)) {
                server.loadFixtures('private');
            }

            return {
                configuration: [db.private]
            };
        });
    }
});