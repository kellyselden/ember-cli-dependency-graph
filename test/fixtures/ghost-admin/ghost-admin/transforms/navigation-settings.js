define('ghost-admin/transforms/navigation-settings', ['exports', 'ghost-admin/models/navigation-item', 'ember-data/transform'], function (exports, _navigationItem, _transform) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var emberA = Ember.A;
    var isEmberArray = Ember.isArray;
    exports.default = _transform.default.extend({
        deserialize: function deserialize(serialized) {
            var navItems = void 0,
                settingsArray = void 0;

            try {
                settingsArray = JSON.parse(serialized) || [];
            } catch (e) {
                settingsArray = [];
            }

            navItems = settingsArray.map(function (itemDetails) {
                return _navigationItem.default.create(itemDetails);
            });

            return emberA(navItems);
        },
        serialize: function serialize(deserialized) {
            var settingsArray = void 0;

            if (isEmberArray(deserialized)) {
                settingsArray = deserialized.map(function (item) {
                    var label = item.get('label').trim();
                    var url = item.get('url').trim();

                    return { label: label, url: url };
                }).compact();
            } else {
                settingsArray = [];
            }

            return JSON.stringify(settingsArray);
        }
    });
});