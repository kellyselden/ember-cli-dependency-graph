define('ghost-admin/models/subscriber', ['exports', 'ember-data/model', 'ghost-admin/mixins/validation-engine', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _validationEngine, _attr, _relationships) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _model.default.extend(_validationEngine.default, {
        validationType: 'subscriber',

        name: (0, _attr.default)('string'),
        email: (0, _attr.default)('string'),
        status: (0, _attr.default)('string'),
        subscribedUrl: (0, _attr.default)('string'),
        subscribedReferrer: (0, _attr.default)('string'),
        unsubscribedUrl: (0, _attr.default)('string'),
        unsubscribedAtUTC: (0, _attr.default)('moment-utc'),
        createdAtUTC: (0, _attr.default)('moment-utc'),
        updatedAtUTC: (0, _attr.default)('moment-utc'),
        createdBy: (0, _attr.default)('number'),
        updatedBy: (0, _attr.default)('number'),

        post: (0, _relationships.belongsTo)('post')
    });
});