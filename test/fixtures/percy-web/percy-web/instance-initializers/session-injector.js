define('percy-web/instance-initializers/session-injector', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'session-injector',
    initialize: function initialize(appInstance) {
      appInstance.inject('controller', 'session', 'service:session');
    }
  };
});