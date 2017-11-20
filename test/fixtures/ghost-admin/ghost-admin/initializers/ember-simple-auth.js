define('ghost-admin/initializers/ember-simple-auth', ['exports', 'ember-simple-auth/configuration', 'ghost-admin/config/environment', 'ghost-admin/utils/ghost-paths', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _configuration, _environment, _ghostPaths, _setupSession, _setupSessionService) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = {
        name: 'ember-simple-auth',
        initialize: function initialize(registry) {
            var config = _environment.default['ember-simple-auth'] || {};
            config.baseURL = (0, _ghostPaths.default)().adminRoot;
            _configuration.default.load(config);

            (0, _setupSession.default)(registry);
            (0, _setupSessionService.default)(registry);
        }
    };
});