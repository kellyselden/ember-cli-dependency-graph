define('percy-web/initializers/analytics', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(application) {
    application.inject('component', 'analytics', 'service:analytics');
    application.inject('route', 'analytics', 'service:analytics');
  }

  exports.default = {
    name: 'analytics',
    initialize: initialize
  };
});