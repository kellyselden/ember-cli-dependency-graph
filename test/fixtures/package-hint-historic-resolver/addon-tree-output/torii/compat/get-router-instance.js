define('torii/compat/get-router-instance', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = getRouterInstance;
  function getRouterInstance(appInstance) {
    // backwards compat for Ember < 2.0
    return appInstance.get('router') || appInstance.lookup('router:main');
  }
});