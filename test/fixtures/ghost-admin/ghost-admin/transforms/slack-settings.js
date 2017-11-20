define('ghost-admin/transforms/slack-settings', ['exports', 'ghost-admin/models/slack-integration', 'ember-data/transform'], function (exports, _slackIntegration, _transform) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var emberA = Ember.A;
    var isEmberArray = Ember.isArray;
    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            var slackObj = void 0,
                settingsArray = void 0;
            try {
                settingsArray = JSON.parse(serialized) || [];
            } catch (e) {
                settingsArray = [];
            }

            slackObj = settingsArray.map(function (itemDetails) {
                return _slackIntegration.default.create(itemDetails);
            });
            return emberA(slackObj);
        },
        serialize: function serialize(deserialized) {
            var settingsArray = void 0;
            if (isEmberArray(deserialized)) {
                settingsArray = deserialized.map(function (item) {
                    var url = (item.get('url') || '').trim();

                    return { url: url };
                }).compact();
            } else {
                settingsArray = [];
            }
            return JSON.stringify(settingsArray);
        }
    });
});