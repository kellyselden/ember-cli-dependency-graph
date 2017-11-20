define('ghost-admin/mirage/factories/subscriber', ['exports', 'moment', 'ember-cli-mirage'], function (exports, _moment, _emberCliMirage) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    var randomDate = function randomDate() {
        var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _moment.default)().subtract(30, 'days').toDate();
        var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();

        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    var statuses = ['pending', 'subscribed'];

    exports.default = _emberCliMirage.Factory.extend({
        name: function name() {
            return _emberCliMirage.faker.name.firstName() + ' ' + _emberCliMirage.faker.name.lastName();
        },

        email: _emberCliMirage.faker.internet.email,
        status: function status() {
            return statuses[Math.floor(Math.random() * statuses.length)];
        },
        createdAt: function createdAt() {
            return randomDate();
        },

        updatedAt: null,
        createdBy: 0,
        updatedBy: null,
        unsubscribedAt: null
    });
});