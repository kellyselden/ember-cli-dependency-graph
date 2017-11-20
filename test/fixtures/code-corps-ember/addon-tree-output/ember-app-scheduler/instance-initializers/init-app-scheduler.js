define('ember-app-scheduler/instance-initializers/init-app-scheduler', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(application) {
    application.lookup('service:scheduler');
  }

  exports.default = {
    name: 'init-app-scheduler',
    initialize: initialize
  };
});