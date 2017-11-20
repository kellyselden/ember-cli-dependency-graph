define('ghost-admin/helpers/is-not', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.isNot = isNot;
    var helper = Ember.Helper.helper;
    function isNot(params) {
        return !params;
    }

    exports.default = helper(function (params) {
        return isNot(params);
    });
});