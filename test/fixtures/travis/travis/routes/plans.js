define('travis/routes/plans', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    needsAuth: false,

    redirect: function redirect() {
      if (!this.get('features.proVersion')) {
        return this.transitionTo('/');
      }
    }
  });
});