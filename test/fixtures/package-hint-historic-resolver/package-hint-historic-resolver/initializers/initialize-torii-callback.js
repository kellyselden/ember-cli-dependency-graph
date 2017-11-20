define('package-hint-historic-resolver/initializers/initialize-torii-callback', ['exports', 'package-hint-historic-resolver/config/environment', 'torii/redirect-handler'], function (exports, _environment, _redirectHandler) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'torii-callback',
    before: 'torii',
    initialize: function initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }
      if (_environment.default.torii && _environment.default.torii.disableRedirectInitializer) {
        return;
      }
      application.deferReadiness();
      _redirectHandler.default.handle(window).catch(function () {
        application.advanceReadiness();
      });
    }
  };
});