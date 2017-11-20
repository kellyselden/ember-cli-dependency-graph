define('ghost-admin/initializers/upgrade-status', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.initialize = initialize;
    function initialize(application) {
        application.inject('route', 'upgradeStatus', 'service:upgrade-status');
    }

    exports.default = {
        name: 'upgrade-status',
        initialize: initialize
    };
});