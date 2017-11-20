define('percy-web/instance-initializers/ga-setup', ['exports', 'percy-web/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ga-setup',
    initialize: function initialize() {
      if (window.ga) {
        window.ga('create', _environment.default.APP.GOOGLE_ANALYTICS_ID, 'auto');
      }
    }
  };
});