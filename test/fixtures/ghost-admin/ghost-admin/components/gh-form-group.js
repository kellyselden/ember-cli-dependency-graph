define('ghost-admin/components/gh-form-group', ['exports', 'ghost-admin/components/gh-validation-status-container'], function (exports, _ghValidationStatusContainer) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _ghValidationStatusContainer.default.extend({
        classNames: 'form-group'
    });
});