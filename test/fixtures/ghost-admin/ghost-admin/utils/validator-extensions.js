define('ghost-admin/utils/validator-extensions', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var isBlank = Ember.isBlank;


    function init() {
        // Provide a few custom validators
        //
        validator.extend('empty', function (str) {
            return isBlank(str);
        });

        validator.extend('notContains', function (str, badString) {
            return str.indexOf(badString) === -1;
        });
    }

    exports.default = {
        init: init
    };
});