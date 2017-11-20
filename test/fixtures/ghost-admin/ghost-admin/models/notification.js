define('ghost-admin/models/notification', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _model, _attr) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _model.default.extend({
        dismissible: (0, _attr.default)('boolean'),
        status: (0, _attr.default)('string'),
        type: (0, _attr.default)('string'),
        message: (0, _attr.default)('string'),
        key: (0, _attr.default)('string')
    });
});