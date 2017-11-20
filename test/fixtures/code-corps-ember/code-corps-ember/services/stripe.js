define('code-corps-ember/services/stripe', ['exports', 'ember-stripe-service/services/stripe'], function (exports, _stripe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _stripe.default;
    }
  });
});