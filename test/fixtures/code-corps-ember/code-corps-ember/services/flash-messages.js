define('code-corps-ember/services/flash-messages', ['exports', 'ember-cli-flash/services/flash-messages'], function (exports, _flashMessages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _flashMessages.default;
    }
  });
});