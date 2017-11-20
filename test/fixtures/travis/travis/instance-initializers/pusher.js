define('travis/instance-initializers/pusher', ['exports', 'travis/config/environment', 'travis/utils/pusher'], function (exports, _environment, _pusher) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(applicationInstance) {
    var app = applicationInstance.application;
    app.pusher = new _pusher.default(_environment.default.pusher, applicationInstance.lookup('service:ajax'));

    app.register('pusher:main', app.pusher, {
      instantiate: false
    });
    app.inject('route', 'pusher', 'pusher:main');
    app.inject('component', 'pusher', 'pusher:main');
    app.pusher.store = applicationInstance.lookup('service:store');
    app.pusher.pusherService = applicationInstance.lookup('service:pusher');
  }

  exports.default = {
    name: 'pusher',
    after: 'ember-data',
    initialize: initialize
  };
});