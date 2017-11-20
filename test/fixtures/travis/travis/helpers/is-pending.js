define('travis/helpers/is-pending', ['exports', 'ember-promise-helpers/helpers/is-pending'], function (exports, _isPending) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isPending.default;
    }
  });
  Object.defineProperty(exports, 'isPending', {
    enumerable: true,
    get: function () {
      return _isPending.isPending;
    }
  });
});