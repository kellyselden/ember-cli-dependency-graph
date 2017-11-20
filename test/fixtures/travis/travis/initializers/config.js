define('travis/initializers/config', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(app) {
    app.register('config:main', _environment.default, {
      instantiate: false
    });
    app.inject('controller', 'config', 'config:main');
    app.inject('component', 'config', 'config:main');
    app.inject('route', 'config', 'config:main');
  }

  exports.default = {
    name: 'config',
    initialize: initialize
  };
});