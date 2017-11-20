define('ghost-admin/mirage/factories/invite', ['exports', 'moment', 'ember-cli-mirage'], function (exports, _moment, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberCliMirage.Factory.extend({
        token: function token(i) {
            return i + '-token';
        },
        email: function email(i) {
            return 'invited-user-' + i + '@example.com';
        },
        expires: function expires() {
            return _moment.default.utc().add(1, 'day').valueOf();
        },
        createdAt: function createdAt() {
            return _moment.default.utc().format();
        },
        createdBy: function createdBy() {
            return 1;
        },
        updatedAt: function updatedAt() {
            return _moment.default.utc().format();
        },
        updatedBy: function updatedBy() {
            return 1;
        },
        status: function status() {
            return 'sent';
        },
        roleId: function roleId() {
            return 1;
        }
    });
});