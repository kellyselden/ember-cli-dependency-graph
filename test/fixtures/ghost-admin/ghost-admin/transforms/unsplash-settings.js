define('ghost-admin/transforms/unsplash-settings', ['exports', 'ember-data/transform', 'ghost-admin/models/unsplash-integration'], function (exports, _transform, _unsplashIntegration) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /* eslint-disable camelcase */
    var DEFAULT_SETTINGS = {
        isActive: true
    };

    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            if (serialized) {
                var settingsObject = void 0;
                try {
                    settingsObject = JSON.parse(serialized) || DEFAULT_SETTINGS;
                } catch (e) {
                    settingsObject = DEFAULT_SETTINGS;
                }

                return _unsplashIntegration.default.create(settingsObject);
            }

            return DEFAULT_SETTINGS;
        },
        serialize: function serialize(deserialized) {
            return deserialized ? JSON.stringify(deserialized) : JSON.stringify(DEFAULT_SETTINGS);
        }
    });
});