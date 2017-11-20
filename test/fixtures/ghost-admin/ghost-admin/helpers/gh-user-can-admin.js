define('ghost-admin/helpers/gh-user-can-admin', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ghUserCanAdmin = ghUserCanAdmin;
    var helper = Ember.Helper.helper;


    // Handlebars Helper {{gh-user-can-admin}} group users by admin and owner using if, or group them author using unless
    // Usage: call helper as with aparameter of session.user
    // e.g - {{#if (gh-user-can-admin session.user)}} 'block content' {{/if}}
    // @param session.user

    function ghUserCanAdmin(params) {
        return !!(params[0].get('isOwner') || params[0].get('isAdmin'));
    }

    exports.default = helper(function (params) {
        return ghUserCanAdmin(params);
    });
});