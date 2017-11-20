define('ghost-admin/models/role', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _model, _attr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var computed = Ember.computed;
    exports.default = _model.default.extend({
        name: (0, _attr.default)('string'),
        description: (0, _attr.default)('string'),
        createdAtUTC: (0, _attr.default)('moment-utc'),
        updatedAtUTC: (0, _attr.default)('moment-utc'),
        createdBy: (0, _attr.default)(),
        updatedBy: (0, _attr.default)(),

        lowerCaseName: computed('name', function () {
            return this.get('name').toLocaleLowerCase();
        })
    });
});