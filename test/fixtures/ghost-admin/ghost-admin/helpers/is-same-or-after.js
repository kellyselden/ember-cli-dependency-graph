define('ghost-admin/helpers/is-same-or-after', ['exports', 'ember-moment/helpers/is-same-or-after'], function (exports, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrAfter.default;
    }
  });
});