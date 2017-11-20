define('ghost-admin/mirage/config/settings', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = mockSettings;
    function mockSettings(server) {
        // These endpoints use the raw database & fixtures without going
        // through the ORM at all (meaning no setting model). This is due
        // to https://github.com/samselikoff/ember-cli-mirage/issues/943
        // as far as can be determined.
        // potential TODO: update once the above issue is fixed? We don't really
        // gain anything from using the ORM for settings so it may not be a good idea
        server.get('/settings/', function (_ref, _ref2) {
            var db = _ref.db;
            var queryParams = _ref2.queryParams;
            var type = queryParams.type;

            var filters = type.split(',');
            var settings = [];

            if (!db.settings) {
                server.loadFixtures('settings');
            }

            filters.forEach(function (type) {
                settings.pushObjects(db.settings.where({ type: type }));
            });

            return {
                settings: settings,
                meta: { filters: { type: type } }
            };
        });

        server.put('/settings/', function (_ref3, _ref4) {
            var db = _ref3.db;
            var requestBody = _ref4.requestBody;

            var newSettings = JSON.parse(requestBody).settings;

            newSettings.forEach(function (newSetting) {
                var key = newSetting.key;


                if (db.settings.where({ key: key }).length > 0) {
                    db.settings.update({ key: key }, newSetting);
                } else {
                    newSetting.type = newSetting.type || 'blog';
                    db.settings.insert(newSetting);
                }
            });

            return {
                meta: {},
                settings: db.settings
            };
        });
    }
});