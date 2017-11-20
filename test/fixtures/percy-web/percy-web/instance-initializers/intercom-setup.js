define('percy-web/instance-initializers/intercom-setup', ['exports', 'percy-web/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'intercom-setup',
    initialize: function initialize() {
      if (window.Intercom) {
        window.Intercom('boot', { app_id: _environment.default.APP.INTERCOM_APP_ID });
      }
    }
  };
});