define('travis/initializers/auth', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(app) {
    app.inject('route', 'auth', 'service:auth');
    app.inject('controller', 'auth', 'service:auth');
    app.inject('application', 'auth', 'service:auth');
    app.inject('component', 'auth', 'service:auth');
    app.inject('service:flashes', 'auth', 'service:auth');
  }

  exports.default = {
    name: 'auth',
    after: 'ember-data',
    initialize: initialize
  };
});